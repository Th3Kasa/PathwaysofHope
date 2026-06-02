# Sets the Production environment variables on Vercel from your local .env.local.
# Run once:  npx vercel login   (opens browser, log in)
# Then:      powershell -ExecutionPolicy Bypass -File .\set-vercel-env.ps1
#
# It links the project non-interactively and pushes the 4 required vars to Production.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# Read .env.local into a hashtable
$envVars = @{}
Get-Content ".env.local" | ForEach-Object {
  if ($_ -match '^\s*([A-Z_]+)\s*=\s*(.+)\s*$') { $envVars[$matches[1]] = $matches[2] }
}

# Link to the existing project (no prompts)
npx vercel link --yes --project pathwaysofhope --scope th3kasas-projects | Out-Null

function Set-ProdEnv($name, $value) {
  if ([string]::IsNullOrWhiteSpace($value) -or $value -like "*REPLACE_ME*") {
    Write-Host "SKIP $name (not set in .env.local)" -ForegroundColor Yellow
    return
  }
  # Remove existing then add fresh
  npx vercel env rm $name production --yes 2>$null | Out-Null
  $value | npx vercel env add $name production | Out-Null
  Write-Host "SET  $name -> Production" -ForegroundColor Green
}

Set-ProdEnv "STRIPE_SECRET_KEY"      $envVars["STRIPE_SECRET_KEY"]
Set-ProdEnv "STRIPE_PUBLISHABLE_KEY" $envVars["STRIPE_PUBLISHABLE_KEY"]
Set-ProdEnv "STRIPE_WEBHOOK_SECRET"  $envVars["STRIPE_WEBHOOK_SECRET"]

# Production site URL — edit this to your real domain before running if different.
"https://pathwaysofhope.org.au" | npx vercel env add NEXT_PUBLIC_SITE_URL production 2>$null | Out-Null
Write-Host "SET  NEXT_PUBLIC_SITE_URL -> Production" -ForegroundColor Green

Write-Host "`nDone. Trigger a redeploy:  npx vercel --prod" -ForegroundColor Cyan
