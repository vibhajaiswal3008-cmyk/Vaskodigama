# Starts the Vaskodigama public preview link.
# Usage:  right-click -> Run with PowerShell   (or)   ./start-preview.ps1
# Keep this window open while your team lead reviews. Press Ctrl+C to stop.
# The PC must stay on. The public URL changes each time you restart.

$env:Path = "C:\Program Files\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host "Building the preview (noindex + banner)..." -ForegroundColor Cyan
$env:NEXT_PUBLIC_PREVIEW = "true"
npm run build | Out-Null

Write-Host "Starting local server on http://localhost:4173 ..." -ForegroundColor Cyan
$server = Start-Process -FilePath "node" -ArgumentList "scripts/serve-out.mjs 4173" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2

Write-Host "Opening public tunnel... your shareable HTTPS link will appear below:`n" -ForegroundColor Green
try {
  & ".\cloudflared.exe" tunnel --url http://localhost:4173 --no-autoupdate
}
finally {
  if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -Force }
  Write-Host "`nPreview stopped." -ForegroundColor Yellow
}
