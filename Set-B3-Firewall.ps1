$ErrorActionPreference = "Stop"

$RuleName = "B3 Floral EBS Port 4173"
$Existing = Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue

if ($Existing) {
  Set-NetFirewallRule `
    -DisplayName $RuleName `
    -Enabled True `
    -Direction Inbound `
    -Action Allow `
    -Profile Any | Out-Null
} else {
  New-NetFirewallRule `
    -DisplayName $RuleName `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort 4173 `
    -Profile Any | Out-Null
}

Write-Host "B3 Floral EBS firewall port 4173 is open."
