@echo off
REM Kollect-It Product Application Launcher
REM Works regardless of execution directory

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
set DESKTOP_APP_DIR=%SCRIPT_DIR%desktop-app

REM Verify path exists
if not exist "%DESKTOP_APP_DIR%" (
    echo ERROR: Desktop app directory not found: %DESKTOP_APP_DIR%
    pause
    exit /b 1
)

REM Change to script directory (product-application root)
cd /d "%SCRIPT_DIR%"

echo ============================================
echo Rebuilding venv and launching Kollect-It App
echo ============================================
echo Repository Root: %SCRIPT_DIR%..
echo Desktop App Dir: %DESKTOP_APP_DIR%

echo.
echo Removing existing .venv (if any)...
if exist .venv (
  rmdir /s /q .venv
)

echo.
echo Creating fresh virtual environment...
python -m venv .venv
if %errorlevel% neq 0 (
  echo Python on PATH may be 3.14 or missing. Trying Python launcher 3.12/3.11...
  py -3.12 -m venv .venv 2>nul || py -3.11 -m venv .venv
)

if not exist .venv (
  echo ERROR: Failed to create virtual environment.
  exit /b 1
)

echo.
echo Activating venv...
call .\.venv\Scripts\activate.bat

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing required packages...
pip install PyQt5 Pillow python-dotenv requests anthropic python-docx numpy

echo.
echo Launching application...
cd /d "%DESKTOP_APP_DIR%"
python main.py

endlocal
exit /b %errorlevel%
