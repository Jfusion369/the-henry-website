@echo off
REM Quick Start Script for The Henry Backend

echo.
echo ======================================
echo The Henry - Backend Quick Start
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
npm --version
echo.

REM Navigate to server directory
cd server

REM Check if .env exists
if not exist .env (
    echo.
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env file with your email configuration
    echo    1. Open server\.env in a text editor
    echo    2. Set your EMAIL_USER and EMAIL_PASSWORD
    echo    3. Save the file
    echo.
    pause
)

REM Check if node_modules exists
if not exist node_modules (
    echo.
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
    echo.
)

REM Start the server
echo.
echo ======================================
echo Starting The Henry Backend Server
echo ======================================
echo.
echo Server will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
