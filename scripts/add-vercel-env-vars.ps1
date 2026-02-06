# Add Email Environment Variables to Vercel
# Adds variables to all three environments: Production, Preview, Development

Write-Host "Adding email environment variables to Vercel..." -ForegroundColor Cyan

$envVars = @(
    @{ Key = "EMAIL_HOST"; Value = "smtp.zoho.com" },
    @{ Key = "EMAIL_PORT"; Value = "587" },
    @{ Key = "EMAIL_USER"; Value = "info@kollect-it.com" },
    @{ Key = "EMAIL_PASSWORD"; Value = "kkCfdWsF7wbK" },
    @{ Key = "EMAIL_FROM"; Value = "Kollect-It <info@kollect-it.com>" },
    @{ Key = "ADMIN_EMAIL"; Value = "info@kollect-it.com" }
)

foreach ($env in $envVars) {
    Write-Host "`nAdding $($env.Key)..." -ForegroundColor Yellow

    # Add to all three environments
    vercel env add $($env.Key) production preview development --force

    # The command will prompt for the value - we'll provide it via input
    Write-Host "Value: $($env.Value)" -ForegroundColor Green
}

Write-Host "`n✅ All variables configured!" -ForegroundColor Green
Write-Host "Please verify in Vercel dashboard: https://vercel.com/james-hortons-projects-6d806c91/kollect-it/settings/environment-variables" -ForegroundColor Cyan
