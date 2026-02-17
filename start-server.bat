@echo off
REM The Henry Website - Backend Server Launcher
REM This script starts the Node.js backend server

setlocal enabledelayedexpansion

echo.
echo ═══════════════════════════════════════════════════════════════
echo  🚀 The Henry Website - Backend Server
echo ═══════════════════════════════════════════════════════════════
echo.
echo 📚 Documentation: See docs\ folder for comprehensive guides
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Navigate to server directory
cd /d "%~dp0server"
if errorlevel 1 (
    echo ❌ ERROR: Could not navigate to server directory
    pause
    exit /b 1
)

echo 📁 Working directory: %CD%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ⚠️  npm dependencies not installed
    echo 📦 Running: npm install
    call npm install
    if errorlevel 1 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ✅ Starting server...
echo ────────────────────────────────────────────────────────────────
echo.

REM Start the server
node server.js

REM If server exits, show exit code
if errorlevel 1 (
    echo.
    echo ❌ Server exited with error code: %ERRORLEVEL%
    pause
) else (
    echo.
    echo ✅ Server exited cleanly
)

endlocal
