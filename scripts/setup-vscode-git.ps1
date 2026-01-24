# Kollect-It VS Code Setup Script
# Run this from PowerShell to set up git workflow commands

$ProjectPath = "C:\Users\james\kollect-it"
$DownloadsPath = "$env:USERPROFILE\Downloads"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kollect-It VS Code Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create docs folder
Write-Host "[1/4] Creating docs folder..." -ForegroundColor Green
$DocsPath = "$ProjectPath\docs"
if (!(Test-Path $DocsPath)) {
    New-Item -ItemType Directory -Path $DocsPath -Force | Out-Null
}
Write-Host "      Created: $DocsPath" -ForegroundColor Gray

# Step 2: Copy documentation files
Write-Host "[2/4] Copying documentation files..." -ForegroundColor Green

$FilesToCopy = @(
    @{ Source = "GIT_WORKFLOW_COMMANDS.md"; Dest = "docs\GIT_WORKFLOW_COMMANDS.md" },
    @{ Source = "COMMANDS.md"; Dest = "docs\COMMANDS.md" },
    @{ Source = "cursorrules.txt"; Dest = ".cursorrules" },
    @{ Source = "CURSOR_AUTOCOMPLETE_FIX.md"; Dest = "docs\CURSOR_AUTOCOMPLETE_FIX.md" },
    @{ Source = "KOLLECT_IT_FULL_AUDIT.md"; Dest = "docs\KOLLECT_IT_FULL_AUDIT.md" },
    @{ Source = "CODEX_REMEDIATION.md"; Dest = "docs\CODEX_REMEDIATION.md" }
)

foreach ($File in $FilesToCopy) {
    $SourceFile = "$DownloadsPath\$($File.Source)"
    $DestFile = "$ProjectPath\$($File.Dest)"
    
    if (Test-Path $SourceFile) {
        Copy-Item $SourceFile -Destination $DestFile -Force
        Write-Host "      Copied: $($File.Source) -> $($File.Dest)" -ForegroundColor Gray
    } else {
        Write-Host "      Skipped (not found): $($File.Source)" -ForegroundColor Yellow
    }
}

# Step 3: Create .vscode folder and tasks
Write-Host "[3/4] Creating VS Code tasks..." -ForegroundColor Green
$VSCodePath = "$ProjectPath\.vscode"
if (!(Test-Path $VSCodePath)) {
    New-Item -ItemType Directory -Path $VSCodePath -Force | Out-Null
}

# Create tasks.json
$TasksJson = @'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Git: Deploy (commit + push)",
      "type": "shell",
      "command": "git add . && git commit -m \"${input:commitMessage}\" && git push origin HEAD",
      "problemMatcher": [],
      "group": "build"
    },
    {
      "label": "Git: Quick Deploy",
      "type": "shell", 
      "command": "git add . && git commit -m \"chore: quick update\" && git push origin HEAD",
      "problemMatcher": []
    },
    {
      "label": "Git: Deploy to Vercel",
      "type": "shell",
      "command": "git add . && git commit -m \"${input:commitMessage}\" && git push origin main && vercel --prod",
      "problemMatcher": []
    },
    {
      "label": "Git: Create Pull Request",
      "type": "shell",
      "command": "git add . && git commit -m \"${input:commitMessage}\" && git push origin HEAD && gh pr create --base main --fill",
      "problemMatcher": []
    },
    {
      "label": "Git: Sync with Main",
      "type": "shell",
      "command": "git fetch origin && git pull origin main && git push origin HEAD",
      "problemMatcher": []
    },
    {
      "label": "Git: Create Feature Branch",
      "type": "shell",
      "command": "git checkout main && git pull origin main && git checkout -b feature/${input:branchName}",
      "problemMatcher": []
    },
    {
      "label": "Git: Status Summary",
      "type": "shell",
      "command": "echo '=== Current Branch ===' && git branch --show-current && echo '' && echo '=== Status ===' && git status -s && echo '' && echo '=== Recent Commits ===' && git log --oneline -5",
      "problemMatcher": []
    },
    {
      "label": "Git: Undo Last Commit",
      "type": "shell",
      "command": "git reset --soft HEAD~1 && git status",
      "problemMatcher": []
    },
    {
      "label": "Build: Run Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "problemMatcher": []
    },
    {
      "label": "Build: Production Build",
      "type": "shell",
      "command": "npm run build",
      "problemMatcher": []
    },
    {
      "label": "Prisma: Generate Client",
      "type": "shell",
      "command": "npx prisma generate",
      "problemMatcher": []
    },
    {
      "label": "Prisma: Push Schema",
      "type": "shell",
      "command": "npx prisma db push",
      "problemMatcher": []
    },
    {
      "label": "Deploy: Full Production Deploy",
      "type": "shell",
      "command": "npx prisma generate && npm run build && git add . && git commit -m \"${input:commitMessage}\" && git push origin main && vercel --prod",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ],
  "inputs": [
    {
      "id": "commitMessage",
      "type": "promptString",
      "description": "Enter commit message (e.g., feat: add new feature)",
      "default": "chore: update"
    },
    {
      "id": "branchName",
      "type": "promptString",
      "description": "Enter branch name (without feature/ prefix)",
      "default": "new-feature"
    }
  ]
}
'@

$TasksJson | Out-File -FilePath "$VSCodePath\tasks.json" -Encoding UTF8
Write-Host "      Created: .vscode\tasks.json" -ForegroundColor Gray

# Create keybindings suggestion file
$KeybindingsInfo = @'
# VS Code Keybindings for Git Workflow

Add these to your VS Code keybindings.json (Ctrl+K Ctrl+S -> Open Keyboard Shortcuts JSON):

```json
[
  {
    "key": "ctrl+shift+d",
    "command": "workbench.action.tasks.runTask",
    "args": "Git: Deploy (commit + push)"
  },
  {
    "key": "ctrl+shift+p ctrl+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Git: Create Pull Request"
  },
  {
    "key": "ctrl+shift+v",
    "command": "workbench.action.tasks.runTask",
    "args": "Git: Deploy to Vercel"
  },
  {
    "key": "ctrl+shift+s",
    "command": "workbench.action.tasks.runTask",
    "args": "Git: Status Summary"
  }
]
```

## How to Use Tasks

1. Press `Ctrl+Shift+P` (Command Palette)
2. Type "Tasks: Run Task"
3. Select from the list:
   - Git: Deploy (commit + push)
   - Git: Quick Deploy
   - Git: Deploy to Vercel
   - Git: Create Pull Request
   - Git: Sync with Main
   - Git: Create Feature Branch
   - Git: Status Summary
   - Git: Undo Last Commit
   - Deploy: Full Production Deploy

## Quick Access

- Press `Ctrl+Shift+B` to run the default build task (Full Production Deploy)
- Or use the keyboard shortcuts above if you add them
'@

$KeybindingsInfo | Out-File -FilePath "$DocsPath\VSCODE_KEYBINDINGS.md" -Encoding UTF8
Write-Host "      Created: docs\VSCODE_KEYBINDINGS.md" -ForegroundColor Gray

# Step 4: Summary
Write-Host ""
Write-Host "[4/4] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HOW TO USE IN VS CODE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Open VS Code in your project folder" -ForegroundColor White
Write-Host "  2. Press Ctrl+Shift+P" -ForegroundColor White
Write-Host "  3. Type 'Tasks: Run Task'" -ForegroundColor White
Write-Host "  4. Select a task like 'Git: Deploy'" -ForegroundColor White
Write-Host ""
Write-Host "  Available Tasks:" -ForegroundColor Yellow
Write-Host "    - Git: Deploy (commit + push)" -ForegroundColor Gray
Write-Host "    - Git: Quick Deploy" -ForegroundColor Gray
Write-Host "    - Git: Deploy to Vercel" -ForegroundColor Gray
Write-Host "    - Git: Create Pull Request" -ForegroundColor Gray
Write-Host "    - Git: Sync with Main" -ForegroundColor Gray
Write-Host "    - Git: Create Feature Branch" -ForegroundColor Gray
Write-Host "    - Git: Status Summary" -ForegroundColor Gray
Write-Host "    - Git: Undo Last Commit" -ForegroundColor Gray
Write-Host "    - Deploy: Full Production Deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "  TIP: Press Ctrl+Shift+B for quick deploy!" -ForegroundColor Cyan
Write-Host ""
