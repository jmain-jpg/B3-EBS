$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 4173
$LanAddress = Get-NetIPAddress -AddressFamily IPv4 -AddressState Preferred -ErrorAction SilentlyContinue |
  Where-Object {
    $_.InterfaceAlias -notmatch "Loopback|VPN|WireGuard" -and
    ($_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" -or $_.IPAddress -like "172.*")
  } |
  Select-Object -First 1 -ExpandProperty IPAddress

$PhoneUrl = if ($LanAddress) { "http://${LanAddress}:$Port/index.html" } else { "Wi-Fi IP not found" }
@"
B3 Floral EBS

Desktop: http://127.0.0.1:$Port/index.html
Phone:   $PhoneUrl

Phone and computer must use the same Wi-Fi.
"@ | Set-Content -Path (Join-Path $Root "B3 Phone URL.txt") -Encoding UTF8

$Existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if ($Existing) {
  exit 0
}

$BundledPython = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if (Test-Path $BundledPython) {
  $Python = $BundledPython
} else {
  $PythonCommand = Get-Command python -ErrorAction SilentlyContinue
  if ($PythonCommand) {
    $Python = $PythonCommand.Source
  } else {
    $Python = (Get-Command py -ErrorAction Stop).Source
  }
}

$LogDir = Join-Path $Root "logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

Start-Process `
  -FilePath $Python `
  -ArgumentList @("b3_server.py") `
  -WorkingDirectory $Root `
  -WindowStyle Hidden `
  -RedirectStandardOutput (Join-Path $LogDir "b3-server.out.log") `
  -RedirectStandardError (Join-Path $LogDir "b3-server.err.log")
