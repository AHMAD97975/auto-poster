@echo off
REM Auto Poster Hub - Environment Setup Script (Windows)
REM This script helps set up the development environment

echo.
echo 🚀 Auto Poster Hub - Environment Setup
echo ======================================
echo.

REM Check if we're in the correct project directory
if not exist package.json (
    echo ❌ Error: package.json not found!
    echo    Please run this script from the root directory of the Auto Poster Hub project.
    exit /b 1
)

REM Verify this is the correct project
findstr /C:"auto-poster-hub" package.json >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Warning: This doesn't appear to be the Auto Poster Hub project.
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i not "%CONTINUE%"=="y" (
        exit /b 1
    )
)

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    echo    Visit: https://nodejs.org/
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully
echo.

REM Setup environment file
if not exist .env.local (
    echo 📝 Creating .env.local file...
    copy .env.example .env.local >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to create .env.local file
        exit /b 1
    )
    echo ✅ .env.local file created
    echo.
    echo ⚠️  IMPORTANT: You need to add your Gemini API key!
    echo    1. Get your API key from: https://aistudio.google.com/apikey
    echo    2. Open .env.local and replace 'your_gemini_api_key_here' with your actual key
    echo.
) else (
    echo ℹ️  .env.local file already exists
    echo.
)

echo ✅ Setup completed successfully!
echo.
echo Next steps:
echo   1. Make sure to add your Gemini API key to .env.local
echo   2. Run 'npm run dev' to start the development server
echo.
pause
