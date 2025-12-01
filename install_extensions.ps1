# ==============================
# AI Development Extensions Installer for VS Code
# ==============================

Write-Host "📦 Installing VS Code AI Extensions..." -ForegroundColor Cyan

# List of extensions to install
$extensions = @(
    # GitHub Copilot
    "GitHub.copilot",
    "GitHub.copilot-chat",

    # OpenAI
    "OpenAI.openai-chatgpt",

    # Claude
    "Anthropic.claude",

    # Markdown Tools
    "yzhang.markdown-all-in-one",
    "bierner.markdown-preview-github-styles",

    # Git Tools
    "eamodio.gitlens",

    # Formatting / Editing
    "esbenp.prettier-vscode",
    "aaron-bond.better-comments"
)

# Function to download & install extensions
foreach ($ext in $extensions) {
    Write-Host "`n⬇ Downloading extension: $ext"

    # Download VSIX to temp folder
    $vsixUrl = "https://marketplace.visualstudio.com/_apis/public/gallery/publishers/$($ext.Split('.')[0])/vsextensions/$($ext.Split('.')[1])/latest/vspackage"
    $vsixPath = "$env:TEMP\$($ext.Split('.')[1]).vsix"

    try {
        Invoke-WebRequest -Uri $vsixUrl -OutFile $vsixPath -UseBasicParsing
        Write-Host "   👉 Downloaded: $vsixPath"
        
        # Install the VSIX
        code --install-extension $vsixPath
        Write-Host "   ✅ Installed: $ext" -ForegroundColor Green
    }
    catch {
        Write-Host "   ❌ Failed: $ext" -ForegroundColor Red
    }
}

Write-Host "`n🎉 All extensions processed."
Write-Host "🔄 Restart VS Code to activate everything." -ForegroundColor Yellow
