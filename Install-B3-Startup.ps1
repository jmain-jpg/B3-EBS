$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$TaskName = "B3 Floral EBS Server"
$WatchdogScript = Join-Path $Root "b3_watchdog.py"
$BundledPythonw = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\pythonw.exe"

if (Test-Path $BundledPythonw) {
  $Pythonw = $BundledPythonw
} else {
  $PythonwCommand = Get-Command pythonw -ErrorAction SilentlyContinue
  if ($PythonwCommand) {
    $Pythonw = $PythonwCommand.Source
  } else {
    throw "Pythonw is required to run the B3 Floral EBS server without a console window."
  }
}

$Action = New-ScheduledTaskAction `
  -Execute $Pythonw `
  -Argument "`"$WatchdogScript`"" `
  -WorkingDirectory $Root

$LogonTrigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$WatchdogTrigger = New-ScheduledTaskTrigger `
  -Once `
  -At ((Get-Date).AddMinutes(1)) `
  -RepetitionInterval (New-TimeSpan -Minutes 1) `
  -RepetitionDuration (New-TimeSpan -Days 3650)
$Settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -MultipleInstances IgnoreNew `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 1) `
  -ExecutionTimeLimit ([TimeSpan]::Zero)

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $Action `
  -Trigger @($LogonTrigger, $WatchdogTrigger) `
  -Settings $Settings `
  -Description "Start the B3 Floral EBS local server on Windows login." `
  -Force | Out-Null

Start-ScheduledTask -TaskName $TaskName
Write-Host "Installed and started: $TaskName"
