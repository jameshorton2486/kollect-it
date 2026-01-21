<#
.SYNOPSIS
    Verifies DNS configuration for Kollect-It domain.

.DESCRIPTION
    This script checks:
    1. A record points to Vercel (76.76.21.21)
    2. CNAME for www points to cname.vercel-dns.com
    3. SSL certificate is valid
    4. Email DNS records (SPF, DKIM for Resend)

.PARAMETER Domain
    The domain to check (default: kollect-it.com)

.PARAMETER CheckEmail
    Also check email DNS records (SPF, DKIM, DMARC)

.EXAMPLE
    .\04-verify-dns.ps1
    
.EXAMPLE
    .\04-verify-dns.ps1 -CheckEmail

.NOTES
    No external dependencies required.
#>

param(
    [string]$Domain = "kollect-it.com",
    [switch]$CheckEmail
)

# Load common functions
. "$PSScriptRoot\lib\common-functions.ps1"

Write-Header "DNS Verification for $Domain"

$allPassed = $true

# ============================================================================
# Expected Values
# ============================================================================

$expectedARecord = "76.76.21.21"
$expectedCname = "cname.vercel-dns.com"

# ============================================================================
# Check A Record (Root Domain)
# ============================================================================

Write-Step "Checking A record for $Domain..."

try {
    $aRecords = Resolve-DnsName -Name $Domain -Type A -ErrorAction Stop | 
                Where-Object { $_.Type -eq 'A' }
    
    if ($aRecords) {
        $ips = $aRecords | Select-Object -ExpandProperty IPAddress
        Write-Host "  Found A records: $($ips -join ', ')" -ForegroundColor White
        
        if ($ips -contains $expectedARecord) {
            Write-Success "A record correctly points to Vercel ($expectedARecord)"
        }
        else {
            Write-Failure "A record does not point to Vercel"
            Write-Host "  Expected: $expectedARecord" -ForegroundColor $Colors.Warning
            Write-Host "  Found: $($ips -join ', ')" -ForegroundColor $Colors.Warning
            $allPassed = $false
        }
    }
    else {
        Write-Failure "No A record found for $Domain"
        $allPassed = $false
    }
}
catch {
    Write-Failure "Could not resolve $Domain"
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Colors.Warning
    $allPassed = $false
}

# ============================================================================
# Check CNAME Record (www subdomain)
# ============================================================================

Write-Host ""
Write-Step "Checking CNAME record for www.$Domain..."

try {
    $cnameRecords = Resolve-DnsName -Name "www.$Domain" -Type CNAME -ErrorAction Stop | 
                    Where-Object { $_.Type -eq 'CNAME' }
    
    if ($cnameRecords) {
        $cname = $cnameRecords | Select-Object -ExpandProperty NameHost
        Write-Host "  Found CNAME: $cname" -ForegroundColor White
        
        if ($cname -eq $expectedCname -or $cname -eq "$expectedCname.") {
            Write-Success "CNAME correctly points to Vercel"
        }
        else {
            Write-Warn "CNAME points to: $cname (expected: $expectedCname)"
            # Not necessarily a failure - could be aliased
        }
    }
    else {
        # Check if it resolves to an A record instead (also valid)
        $wwwA = Resolve-DnsName -Name "www.$Domain" -Type A -ErrorAction SilentlyContinue
        if ($wwwA) {
            Write-Warn "www.$Domain resolves via A record instead of CNAME"
            Write-Host "  This is valid but CNAME is preferred" -ForegroundColor White
        }
        else {
            Write-Failure "No CNAME record found for www.$Domain"
            $allPassed = $false
        }
    }
}
catch {
    Write-Failure "Could not resolve www.$Domain"
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Colors.Warning
    $allPassed = $false
}

# ============================================================================
# Check HTTPS/SSL Certificate
# ============================================================================

Write-Host ""
Write-Step "Checking HTTPS/SSL certificate..."

try {
    $request = [System.Net.HttpWebRequest]::Create("https://$Domain")
    $request.Method = "HEAD"
    $request.Timeout = 10000
    $request.AllowAutoRedirect = $true
    
    $response = $request.GetResponse()
    $cert = $request.ServicePoint.Certificate
    
    if ($cert) {
        $certExpiry = [DateTime]::Parse($cert.GetExpirationDateString())
        $daysUntilExpiry = ($certExpiry - (Get-Date)).Days
        
        Write-Host "  Certificate Subject: $($cert.Subject)" -ForegroundColor White
        Write-Host "  Expires: $certExpiry ($daysUntilExpiry days)" -ForegroundColor White
        
        if ($daysUntilExpiry -gt 7) {
            Write-Success "SSL certificate is valid"
        }
        elseif ($daysUntilExpiry -gt 0) {
            Write-Warn "SSL certificate expires in $daysUntilExpiry days"
        }
        else {
            Write-Failure "SSL certificate has expired!"
            $allPassed = $false
        }
    }
    
    $response.Close()
}
catch {
    Write-Failure "Could not establish HTTPS connection"
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Colors.Warning
    $allPassed = $false
}

# ============================================================================
# Check Website Accessibility
# ============================================================================

Write-Host ""
Write-Step "Checking website accessibility..."

$urls = @(
    "https://$Domain",
    "https://www.$Domain"
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "$url is accessible (HTTP $($response.StatusCode))"
        }
        else {
            Write-Warn "$url returned HTTP $($response.StatusCode)"
        }
    }
    catch {
        Write-Failure "$url is not accessible"
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor $Colors.Warning
        $allPassed = $false
    }
}

# ============================================================================
# Check Email DNS Records (Optional)
# ============================================================================

if ($CheckEmail) {
    Write-Host ""
    Write-Header "Email DNS Records"
    
    # Check SPF Record
    Write-Step "Checking SPF record..."
    try {
        $spfRecords = Resolve-DnsName -Name $Domain -Type TXT -ErrorAction Stop |
                      Where-Object { $_.Strings -match "v=spf1" }
        
        if ($spfRecords) {
            $spf = $spfRecords.Strings -join ""
            Write-Host "  Found SPF: $spf" -ForegroundColor White
            
            if ($spf -match "include:_spf.resend.com") {
                Write-Success "SPF record includes Resend"
            }
            else {
                Write-Warn "SPF record does not include Resend (_spf.resend.com)"
            }
        }
        else {
            Write-Warn "No SPF record found"
        }
    }
    catch {
        Write-Failure "Could not check SPF record"
    }
    
    # Check DKIM Record (Resend)
    Write-Host ""
    Write-Step "Checking DKIM record (Resend)..."
    try {
        $dkimRecords = Resolve-DnsName -Name "resend._domainkey.$Domain" -Type CNAME -ErrorAction Stop
        
        if ($dkimRecords) {
            Write-Success "DKIM record found for Resend"
            Write-Host "  Points to: $($dkimRecords.NameHost)" -ForegroundColor White
        }
        else {
            Write-Warn "No DKIM record found for resend._domainkey.$Domain"
        }
    }
    catch {
        Write-Warn "DKIM record not found (may not be set up yet)"
    }
    
    # Check DMARC Record
    Write-Host ""
    Write-Step "Checking DMARC record..."
    try {
        $dmarcRecords = Resolve-DnsName -Name "_dmarc.$Domain" -Type TXT -ErrorAction Stop |
                        Where-Object { $_.Strings -match "v=DMARC1" }
        
        if ($dmarcRecords) {
            Write-Success "DMARC record found"
            Write-Host "  Value: $($dmarcRecords.Strings)" -ForegroundColor White
        }
        else {
            Write-Warn "No DMARC record found"
        }
    }
    catch {
        Write-Warn "DMARC record not found"
    }
    
    # Check MX Records
    Write-Host ""
    Write-Step "Checking MX records..."
    try {
        $mxRecords = Resolve-DnsName -Name $Domain -Type MX -ErrorAction Stop |
                     Where-Object { $_.Type -eq 'MX' }
        
        if ($mxRecords) {
            Write-Success "MX records found:"
            foreach ($mx in $mxRecords | Sort-Object Preference) {
                Write-Host "  Priority $($mx.Preference): $($mx.NameExchange)" -ForegroundColor White
            }
        }
        else {
            Write-Warn "No MX records found (email receiving may not work)"
        }
    }
    catch {
        Write-Warn "Could not check MX records"
    }
}

# ============================================================================
# Required DNS Records Reference
# ============================================================================

Write-Host ""
Write-Header "Required DNS Records for Bluehost"

Write-Host "Copy these records to your Bluehost DNS settings:" -ForegroundColor $Colors.Info
Write-Host ""

Write-Host "WEBSITE RECORDS:" -ForegroundColor $Colors.Header
Write-Host "  Type: A     | Host: @   | Value: 76.76.21.21" -ForegroundColor White
Write-Host "  Type: CNAME | Host: www | Value: cname.vercel-dns.com" -ForegroundColor White
Write-Host ""

if ($CheckEmail) {
    Write-Host "EMAIL RECORDS (Resend):" -ForegroundColor $Colors.Header
    Write-Host "  Type: TXT   | Host: @                  | Value: v=spf1 include:_spf.resend.com ~all" -ForegroundColor White
    Write-Host "  Type: CNAME | Host: resend._domainkey  | Value: (from Resend dashboard)" -ForegroundColor White
    Write-Host "  Type: TXT   | Host: _dmarc             | Value: v=DMARC1; p=none;" -ForegroundColor White
    Write-Host ""
}

# ============================================================================
# Summary
# ============================================================================

Write-Host ""
Write-Header "Summary"

if ($allPassed) {
    Write-Success "All DNS checks passed!"
    Write-Host ""
    Write-Host "Your domain is correctly configured for Vercel hosting." -ForegroundColor $Colors.Info
}
else {
    Write-Failure "Some DNS checks failed"
    Write-Host ""
    Write-Host "Please update your DNS records and wait for propagation." -ForegroundColor $Colors.Warning
    Write-Host "DNS changes can take 15 minutes to 48 hours to propagate." -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "Check propagation status at: https://dnschecker.org" -ForegroundColor $Colors.Info
}

# ============================================================================
# Next Steps
# ============================================================================

Write-Host ""
Write-Header "Next Steps"

Write-Host "1. Run API endpoint tests:" -ForegroundColor $Colors.Info
Write-Host "   .\05-test-api-endpoints.ps1" -ForegroundColor White
Write-Host ""

Write-Host "2. Run full pre-flight check:" -ForegroundColor $Colors.Info
Write-Host "   .\06-pre-flight-check.ps1" -ForegroundColor White
