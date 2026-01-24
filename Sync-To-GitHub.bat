@echo off
REM ============================================================
REM Kollect-It GitHub Sync - Double-Click Launcher
REM ============================================================
REM 
REM Just double-click this file to sync with GitHub!
REM 
REM ============================================================

title Kollect-It GitHub Sync

cd /d C:\Users\james\kollect-it

echo.
echo ========================================
echo   KOLLECT-IT GITHUB SYNC
echo ========================================
echo.

REM Run the PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\github-sync.ps1"

echo.
echo ========================================
echo Press any key to close...
pause > nul
