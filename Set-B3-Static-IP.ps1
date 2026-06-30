$ErrorActionPreference = "Stop"

$InterfaceAlias = "Wi-Fi 2"
$IPAddress = "192.168.1.26"
$PrefixLength = 24
$Gateway = "192.168.1.1"
$DnsServer = "192.168.1.1"

netsh interface ipv4 set address `
  name="$InterfaceAlias" `
  source=static `
  address=$IPAddress `
  mask=255.255.255.0 `
  gateway=$Gateway `
  store=persistent | Out-Null

netsh interface ipv4 set dnsservers `
  name="$InterfaceAlias" `
  source=static `
  address=$DnsServer `
  validate=no | Out-Null

Start-Sleep -Seconds 3

$IpInterface = Get-NetIPInterface -InterfaceAlias $InterfaceAlias -AddressFamily IPv4
$Address = Get-NetIPAddress -InterfaceAlias $InterfaceAlias -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -eq $IPAddress } |
  Select-Object -First 1

if ($IpInterface.Dhcp -ne "Disabled" -or -not $Address) {
  throw "Static IP setup could not be verified."
}

$Result = @"
B3 Floral EBS static IP setup completed.

IP address: $IPAddress
Gateway:    $Gateway
Phone URL: http://${IPAddress}:4173/index.html
"@

$Result | Set-Content -Path (Join-Path $PSScriptRoot "B3 Static IP Result.txt") -Encoding UTF8
Write-Host $Result
