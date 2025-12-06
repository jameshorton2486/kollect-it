# ============================================
# Auto-configure VS Code settings.json
# Creates a clean, stable, AI-ready environment
# ============================================

Write-Host "⚙ Configuring Visual Studio Code settings.json..." -ForegroundColor Cyan

# Detect VS Code user settings path
$settingsPath = "$env:APPDATA\Code\User\settings.json"

if (!(Test-Path $settingsPath)) {
    Write-Host "❌ Could not find settings.json at: $settingsPath" -ForegroundColor Red
    exit
}

# JSON block for optimal AI + Markdown development
$settings = @"
{
    // =====================================
    // AI DEVELOPMENT SETTINGS
    // =====================================

    // GitHub Copilot
    "github.copilot.enable": {
        "*": true
    },
    "github.copilot.inlineSuggest.enable": true,
    "github.copilot.chat.editorSelection.enabled": true,
    "github.copilot.suggestions.showVerboseStatusNotifications": false,

    // OpenAI VS Code Extension (ignored if not installed)
    "openai.apiKey": "",
    "openai.defaultModel": "gpt-4o",
    "openai.suggestedModels": [
        "gpt-4o",
        "gpt-5",
        "gpt-5.1"
    ],

    // Claude VS Code Extension (ignored if not installed)
    "claude.apiKey": "",
    "claude.defaultModel": "claude-3.5-sonnet",

    // =====================================
    // EDITOR PREFERENCES
    // =====================================

    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.wordWrap": "on",
    "editor.minimap.enabled": false,
    "editor.formatOnSave": true,
    "editor.formatOnPaste": true,
    "editor.smoothScrolling": true,
    "editor.codeActionsOnSave": {
        "source.organizeImports": "always"
    },
    "editor.renderWhitespace": "selection",

    // =====================================
    // MARKDOWN SETTINGS
    // =====================================

    "markdown.preview.breaks": true,
    "markdown.preview.typographer": true,
    "markdown.extension.toc.levels": "1..6",
    "markdown.extension.print.theme": "light",
    "markdown.extension.italic.indicator": "_",
    "markdown.extension.tableFormatter.enabled": true,

    // Cleanup
    "files.trimTrailingWhitespace": true,
    "files.trimFinalNewlines": true,

    // =====================================
    // FILE MANAGEMENT
    // =====================================

    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 700,

    // =====================================
    // GIT / GITLENS (ignored if extension missing)
    // =====================================

    "git.autofetch": true,
    "git.confirmSync": false,
    "gitlens.currentLine.enabled": false

}
"@

# Write settings.json to disk
$settings | Out-File -FilePath $settingsPath -Encoding utf8

Write-Host "✅ VS Code settings.json successfully configured!" -ForegroundColor Green
Write-Host "📌 File saved to: $settingsPath" -ForegroundColor Cyan

Write-Host "`n🔄 Please restart VS Code to apply new settings." -ForegroundColor Yellow
