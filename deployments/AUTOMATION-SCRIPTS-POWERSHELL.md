# PowerShell Automation Scripts for Kollect-It

## Overview
These scripts automate batch operations for product management. Use them after implementing the core system.

---

## Script 1: Validate Product Folders

### File: `scripts/Validate-ProductFolders.ps1`

```powershell
<#
.SYNOPSIS
Validates product folders for proper structure and naming

.DESCRIPTION
Scans a directory of product folders and validates:
- SKU naming format [SKU-YYYY-XXX]
- Required files (main.jpg)
- Image file formats
- Optional notes.txt
- No duplicate SKUs

.PARAMETER FolderPath
Path to directory containing product folders

.EXAMPLE
.\Validate-ProductFolders.ps1 -FolderPath "D:\Kollect-It Photos"

.NOTES
Author: James
Version: 1.0
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$FolderPath
)

# Colors for output
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }

# Validation results
$validFolders = @()
$invalidFolders = @()
$warnings = @()

# Allowed image extensions
$allowedImageExts = @('.jpg', '.jpeg', '.png', '.webp')

# SKU regex pattern
$skuPattern = '^SKU-(\d{4})-(\d{3})$'

Write-Info "Starting validation of: $FolderPath"
Write-Info ""

# Check if path exists
if (-not (Test-Path $FolderPath)) {
    Write-Error "Path not found: $FolderPath"
    exit 1
}

# Get all subdirectories
$folders = Get-ChildItem -Path $FolderPath -Directory

if ($folders.Count -eq 0) {
    Write-Warning "No folders found in: $FolderPath"
    exit 0
}

Write-Info "Found $($folders.Count) folders to validate"
Write-Info ""

foreach ($folder in $folders) {
    $folderName = $folder.Name
    $folderPath = $folder.FullName
    $isValid = $true
    $folderIssues = @()
    
    Write-Host "Checking: $folderName" -ForegroundColor White
    
    # Extract SKU from folder name
    if ($folderName -match '\[([^\]]+)\]') {
        $sku = $matches[1]
        
        # Validate SKU format
        if ($sku -match $skuPattern) {
            $year = [int]$matches[1]
            $number = [int]$matches[2]
            
            # Check year range
            $currentYear = (Get-Date).Year
            if ($year -lt 2020 -or $year -gt ($currentYear + 1)) {
                $folderIssues += "Invalid year: $year (must be 2020-$($currentYear + 1))"
                $isValid = $false
            }
            
            # Check number range
            if ($number -lt 1 -or $number -gt 999) {
                $folderIssues += "Invalid number: $number (must be 001-999)"
                $isValid = $false
            }
            
            Write-Success "  SKU format valid: $sku"
        }
        else {
            $folderIssues += "SKU format invalid: '$sku' (expected: SKU-YYYY-XXX)"
            $isValid = $false
        }
    }
    else {
        $folderIssues += "No SKU found in folder name (expected: [SKU-YYYY-XXX] Product Name)"
        $isValid = $false
    }
    
    # Check for main.jpg
    $mainImage = Join-Path $folderPath "main.jpg"
    if (Test-Path $mainImage) {
        Write-Success "  main.jpg found"
    }
    else {
        $folderIssues += "Missing required file: main.jpg"
        $isValid = $false
    }
    
    # Count image files
    $imageFiles = Get-ChildItem -Path $folderPath -File | 
        Where-Object { $allowedImageExts -contains $_.Extension.ToLower() }
    
    if ($imageFiles.Count -eq 0) {
        $folderIssues += "No image files found"
        $isValid = $false
    }
    else {
        Write-Success "  Found $($imageFiles.Count) image file(s)"
        
        # Warn if too few
        if ($imageFiles.Count -lt 3) {
            $warnings += "$folderName - Only $($imageFiles.Count) images (recommend 5+)"
        }
    }
    
    # Check for notes.txt (optional but recommended)
    $notesFile = Join-Path $folderPath "notes.txt"
    if (Test-Path $notesFile) {
        $notesContent = Get-Content $notesFile -Raw
        if ($notesContent.Length -gt 50) {
            Write-Success "  notes.txt found ($(($notesContent.Length)) characters)"
        }
        else {
            Write-Warning "  notes.txt found but very short"
            $warnings += "$folderName - notes.txt is very short ($(($notesContent.Length)) chars)"
        }
    }
    else {
        Write-Warning "  notes.txt not found (optional but helpful for AI)"
        $warnings += "$folderName - Missing notes.txt (AI will be less accurate)"
    }
    
    # Check for unexpected files
    $allFiles = Get-ChildItem -Path $folderPath -File
    $unexpectedFiles = $allFiles | Where-Object { 
        ($allowedImageExts -notcontains $_.Extension.ToLower()) -and 
        ($_.Name -ne "notes.txt") -and
        ($_.Extension -ne ".txt")
    }
    
    if ($unexpectedFiles.Count -gt 0) {
        Write-Warning "  Found $($unexpectedFiles.Count) unexpected file(s):"
        foreach ($file in $unexpectedFiles) {
            Write-Warning "    - $($file.Name)"
        }
    }
    
    # Summary for this folder
    if ($isValid) {
        $validFolders += [PSCustomObject]@{
            FolderName = $folderName
            SKU = $sku
            Path = $folderPath
            ImageCount = $imageFiles.Count
            HasNotes = (Test-Path $notesFile)
        }
        Write-Success "  ✓ Folder is valid`n"
    }
    else {
        $invalidFolders += [PSCustomObject]@{
            FolderName = $folderName
            Path = $folderPath
            Issues = $folderIssues
        }
        Write-Error "  ✗ Folder has issues:"
        foreach ($issue in $folderIssues) {
            Write-Error "    - $issue"
        }
        Write-Host ""
    }
}

# Final summary
Write-Host "="*60 -ForegroundColor Gray
Write-Host "VALIDATION SUMMARY" -ForegroundColor White
Write-Host "="*60 -ForegroundColor Gray

Write-Success "Valid folders: $($validFolders.Count)"
Write-Error "Invalid folders: $($invalidFolders.Count)"
Write-Warning "Warnings: $($warnings.Count)"

if ($validFolders.Count -gt 0) {
    Write-Host "`nVALID FOLDERS:" -ForegroundColor Green
    $validFolders | Format-Table -AutoSize FolderName, SKU, ImageCount, HasNotes
}

if ($invalidFolders.Count -gt 0) {
    Write-Host "`nINVALID FOLDERS:" -ForegroundColor Red
    foreach ($folder in $invalidFolders) {
        Write-Host "  $($folder.FolderName)" -ForegroundColor Red
        foreach ($issue in $folder.Issues) {
            Write-Host "    - $issue" -ForegroundColor Red
        }
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`nWARNINGS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Warning "  $warning"
    }
}

# Check for duplicate SKUs
$skus = $validFolders | Select-Object -ExpandProperty SKU
$duplicates = $skus | Group-Object | Where-Object { $_.Count -gt 1 }

if ($duplicates) {
    Write-Host "`nDUPLICATE SKUs DETECTED:" -ForegroundColor Red
    foreach ($dup in $duplicates) {
        Write-Error "  $($dup.Name) appears $($dup.Count) times"
    }
}

# Export valid folders to JSON for import script
if ($validFolders.Count -gt 0) {
    $exportPath = Join-Path $PSScriptRoot "valid-products.json"
    $validFolders | ConvertTo-Json -Depth 10 | Out-File -FilePath $exportPath -Encoding UTF8
    Write-Info "`nExported valid folders to: $exportPath"
    Write-Info "Use this file with Import-ProductsToKollectIt.ps1"
}

Write-Host ""
Write-Info "Validation complete!"
```

---

## Script 2: Generate Import JSON

### File: `scripts/Generate-ImportJSON.ps1`

```powershell
<#
.SYNOPSIS
Generates JSON file for bulk product import

.DESCRIPTION
Scans validated product folders and generates a JSON file
that can be used for bulk import into Kollect-It database.

Includes:
- SKU and metadata
- Image file listings
- Notes content
- Suggested category (manual confirmation required)

.PARAMETER FolderPath
Path to directory containing validated product folders

.PARAMETER OutputFile
Path to output JSON file (default: products-import.json)

.EXAMPLE
.\Generate-ImportJSON.ps1 -FolderPath "D:\Kollect-It Photos" -OutputFile "import-2025-01.json"

.NOTES
Requires: Validate-ProductFolders.ps1 to be run first
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$FolderPath,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputFile = "products-import.json"
)

function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }

# Image type detection
function Get-ImageType {
    param([string]$FileName)
    
    $lower = $FileName.ToLower()
    
    if ($lower -like "*main*") { return "main" }
    if ($lower -like "*signature*") { return "signature" }
    if ($lower -like "*condition*") { return "condition" }
    if ($lower -like "*provenance*") { return "provenance" }
    if ($lower -like "*detail*") { return "detail" }
    if ($lower -like "*spine*") { return "spine" }
    if ($lower -like "*cover*") { return "cover" }
    if ($lower -like "*back*" -or $lower -like "*reverse*") { return "back" }
    if ($lower -like "*frame*") { return "frame" }
    
    return "additional"
}

function Get-ImageOrder {
    param([string]$Type)
    
    switch ($Type) {
        "main" { return 0 }
        "cover" { return 5 }
        "signature" { return 10 }
        "spine" { return 15 }
        "condition" { return 20 }
        "back" { return 25 }
        "provenance" { return 30 }
        "frame" { return 35 }
        "detail" { return 40 }
        default { return 50 }
    }
}

function Suggest-Category {
    param([string]$FolderName, [string]$Notes)
    
    $combined = "$FolderName $Notes".ToLower()
    
    if ($combined -match "book|first edition|signed|hemingway|twain|literature") {
        return "Rare Books"
    }
    if ($combined -match "painting|art|sculpture|canvas|framed|artist") {
        return "Fine Art"
    }
    if ($combined -match "wwii|wwi|military|medal|uniform|army|navy") {
        return "Militaria"
    }
    
    return "Collectibles"
}

Write-Info "Starting import JSON generation..."
Write-Info "Source: $FolderPath"
Write-Info ""

if (-not (Test-Path $FolderPath)) {
    Write-Error "Path not found: $FolderPath"
    exit 1
}

$products = @()
$allowedImageExts = @('.jpg', '.jpeg', '.png', '.webp')
$skuPattern = '^\[SKU-(\d{4})-(\d{3})\]'

$folders = Get-ChildItem -Path $FolderPath -Directory

foreach ($folder in $folders) {
    if ($folder.Name -match $skuPattern) {
        $sku = "SKU-$($matches[1])-$($matches[2])"
        $folderPath = $folder.FullName
        
        Write-Info "Processing: $sku"
        
        # Get notes
        $notesPath = Join-Path $folderPath "notes.txt"
        $notes = if (Test-Path $notesPath) { 
            Get-Content $notesPath -Raw 
        } else { 
            "" 
        }
        
        # Get images
        $imageFiles = Get-ChildItem -Path $folderPath -File | 
            Where-Object { $allowedImageExts -contains $_.Extension.ToLower() }
        
        $images = @()
        foreach ($img in $imageFiles) {
            $type = Get-ImageType -FileName $img.Name
            $order = Get-ImageOrder -Type $type
            
            # Extract number from filename if exists
            if ($img.Name -match '(\d+)') {
                $order += [int]$matches[1]
            }
            
            $images += [PSCustomObject]@{
                fileName = $img.Name
                relativePath = $img.FullName.Replace($FolderPath, "").TrimStart('\', '/')
                type = $type
                order = $order
                suggestedAlt = $img.BaseName -replace '-|_', ' '
            }
        }
        
        # Sort images by order
        $images = $images | Sort-Object -Property order
        
        # Suggest category
        $suggestedCategory = Suggest-Category -FolderName $folder.Name -Notes $notes
        
        $products += [PSCustomObject]@{
            sku = $sku
            skuYear = [int]$matches[1]
            skuNumber = [int]$matches[2]
            folderName = $folder.Name
            folderPath = $folderPath
            suggestedCategory = $suggestedCategory
            notes = $notes
            hasNotes = ($notes.Length -gt 0)
            images = $images
            imageCount = $images.Count
            readyForImport = ($images.Count -gt 0)
        }
        
        Write-Success "  $($images.Count) images found, Category: $suggestedCategory"
    }
}

# Generate summary
$totalProducts = $products.Count
$withNotes = ($products | Where-Object { $_.hasNotes }).Count
$avgImages = ($products | Measure-Object -Property imageCount -Average).Average

Write-Host ""
Write-Host "="*60 -ForegroundColor Gray
Write-Host "GENERATION SUMMARY" -ForegroundColor White
Write-Host "="*60 -ForegroundColor Gray
Write-Host "Total products: $totalProducts" -ForegroundColor Green
Write-Host "With notes: $withNotes" -ForegroundColor Green
Write-Host "Average images: $([math]::Round($avgImages, 1))" -ForegroundColor Green

# Export to JSON
$outputPath = if ([System.IO.Path]::IsPathRooted($OutputFile)) {
    $OutputFile
} else {
    Join-Path $PSScriptRoot $OutputFile
}

$exportData = [PSCustomObject]@{
    generatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    sourcePath = $FolderPath
    totalProducts = $totalProducts
    products = $products
}

$exportData | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding UTF8

Write-Success "`nExported to: $outputPath"
Write-Info "File size: $([math]::Round((Get-Item $outputPath).Length / 1KB, 2)) KB"

# Category breakdown
Write-Host "`nCATEGORY BREAKDOWN:" -ForegroundColor White
$products | Group-Object -Property suggestedCategory | 
    Sort-Object -Property Count -Descending |
    ForEach-Object {
        Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor Cyan
    }

Write-Host ""
Write-Info "Next steps:"
Write-Info "1. Review the JSON file"
Write-Info "2. Upload images to ImageKit (manual or script)"
Write-Info "3. Use the web admin to import products"
Write-Host ""
```

---

## Script 3: Upload Images to ImageKit

### File: `scripts/Upload-ImagesToImageKit.ps1`

```powershell
<#
.SYNOPSIS
Uploads product images to ImageKit CDN

.DESCRIPTION
Reads the import JSON and uploads all images to ImageKit.
Organizes images in folders by SKU: /products/SKU-YYYY-XXX/

Requires ImageKit API credentials in environment variables or .env file.

.PARAMETER ImportJSON
Path to the import JSON file from Generate-ImportJSON.ps1

.PARAMETER EnvFile
Path to .env.local file containing ImageKit credentials (optional)

.EXAMPLE
.\Upload-ImagesToImageKit.ps1 -ImportJSON "products-import.json"

.NOTES
Environment variables needed:
- IMAGEKIT_PUBLIC_KEY
- IMAGEKIT_PRIVATE_KEY
- IMAGEKIT_URL_ENDPOINT
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$ImportJSON,
    
    [Parameter(Mandatory=$false)]
    [string]$EnvFile = ".env.local"
)

function Write-Info { param($Message) Write-Host "ℹ $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "✓ $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "✗ $Message" -ForegroundColor Red }
function Write-Warning { param($Message) Write-Host "⚠ $Message" -ForegroundColor Yellow }

# Load .env file if it exists
if (Test-Path $EnvFile) {
    Write-Info "Loading credentials from: $EnvFile"
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.+?)\s*$') {
            $key = $matches[1]
            $value = $matches[2]
            [System.Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

# Check credentials
$publicKey = $env:IMAGEKIT_PUBLIC_KEY
$privateKey = $env:IMAGEKIT_PRIVATE_KEY
$urlEndpoint = $env:IMAGEKIT_URL_ENDPOINT

if (-not $publicKey -or -not $privateKey -or -not $urlEndpoint) {
    Write-Error "ImageKit credentials not found!"
    Write-Info "Set these environment variables:"
    Write-Info "  IMAGEKIT_PUBLIC_KEY"
    Write-Info "  IMAGEKIT_PRIVATE_KEY"
    Write-Info "  IMAGEKIT_URL_ENDPOINT"
    exit 1
}

Write-Success "ImageKit credentials loaded"

# Load import JSON
if (-not (Test-Path $ImportJSON)) {
    Write-Error "Import JSON not found: $ImportJSON"
    exit 1
}

$importData = Get-Content $ImportJSON -Raw | ConvertFrom-Json
$products = $importData.products

Write-Info "Found $($products.Count) products to process"
Write-Host ""

# Upload results
$uploadResults = @()
$successCount = 0
$failCount = 0

foreach ($product in $products) {
    Write-Info "Processing: $($product.sku)"
    
    $productResults = @{
        sku = $product.sku
        uploadedImages = @()
        failedImages = @()
    }
    
    foreach ($image in $product.images) {
        $sourcePath = Join-Path $product.folderPath $image.fileName
        
        if (-not (Test-Path $sourcePath)) {
            Write-Warning "  File not found: $($image.fileName)"
            $productResults.failedImages += $image.fileName
            $failCount++
            continue
        }
        
        try {
            # ImageKit folder path
            $folder = "/products/$($product.sku)"
            
            # NOTE: Actual upload requires ImageKit SDK or REST API call
            # This is a placeholder - you'd need to implement the actual upload
            # using Invoke-RestMethod with proper authentication
            
            Write-Info "  Would upload: $($image.fileName) → $folder"
            
            # Simulated upload result
            $imageKitUrl = "$urlEndpoint$folder/$($image.fileName)"
            
            $productResults.uploadedImages += [PSCustomObject]@{
                fileName = $image.fileName
                url = $imageKitUrl
                type = $image.type
                order = $image.order
                alt = $image.suggestedAlt
            }
            
            $successCount++
            Write-Success "  ✓ Uploaded: $($image.fileName)"
            
        }
        catch {
            Write-Error "  ✗ Failed: $($image.fileName) - $($_.Exception.Message)"
            $productResults.failedImages += $image.fileName
            $failCount++
        }
    }
    
    $uploadResults += $productResults
    Write-Host ""
}

# Summary
Write-Host "="*60 -ForegroundColor Gray
Write-Host "UPLOAD SUMMARY" -ForegroundColor White
Write-Host "="*60 -ForegroundColor Gray
Write-Success "Successful uploads: $successCount"
Write-Error "Failed uploads: $failCount"

# Export results
$outputFile = $ImportJSON -replace '\.json$', '-uploaded.json'
$uploadResults | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8

Write-Info "`nUpload results saved to: $outputFile"
Write-Info "Use this file to create products in the database"
```

---

## Quick Usage Guide

### Step-by-Step Workflow

```powershell
# 1. Validate your product folders
cd C:\Users\james\kollect-it-marketplace-1\scripts
.\Validate-ProductFolders.ps1 -FolderPath "D:\Kollect-It Photos"

# Review output, fix any issues

# 2. Generate import JSON
.\Generate-ImportJSON.ps1 -FolderPath "D:\Kollect-It Photos" -OutputFile "import-january-2025.json"

# 3. Review the JSON file
code import-january-2025.json

# 4. Upload images to ImageKit (requires implementation)
.\Upload-ImagesToImageKit.ps1 -ImportJSON "import-january-2025.json"

# 5. Use web admin to create products from JSON
# Navigate to http://localhost:3000/admin/bulk-import
# Upload the *-uploaded.json file
```

---

## Notes on ImageKit Upload Script

The `Upload-ImagesToImageKit.ps1` script is a **template**. To make it fully functional, you need to:

### Option A: Use ImageKit SDK (Recommended)
Install ImageKit CLI/SDK and call it from PowerShell

### Option B: Implement REST API calls
```powershell
# Example of actual ImageKit upload via REST API
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${privateKey}:"))
$headers = @{
    "Authorization" = "Basic $auth"
}

$form = @{
    file = Get-Item $sourcePath
    fileName = $image.fileName
    folder = "/products/$($product.sku)"
}

$response = Invoke-RestMethod -Uri "https://upload.imagekit.io/api/v1/files/upload" `
    -Method Post -Headers $headers -Form $form

$imageKitUrl = $response.url
```

### Option C: Manual Upload
Use ImageKit web dashboard to upload folders, then update JSON with URLs

---

## Security Notes

**Never commit .env files with API keys!**

Add to `.gitignore`:
```
.env.local
*.env
*-uploaded.json
*-import.json
```

---

These scripts provide the automation framework. The actual ImageKit upload implementation can be completed based on your preferred method.
