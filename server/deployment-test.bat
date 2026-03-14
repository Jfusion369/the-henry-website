@echo off
REM ============================================================================
REM Deployment Test Runner for The Henry Website
REM Runs comprehensive functional tests on deployment
REM ============================================================================

setlocal enabledelayedexpansion

REM Parse command line arguments
set BASE_URL=%1
if "%BASE_URL%"=="" (
    set BASE_URL=http://localhost:3000
)

title Deployment Test Suite - %BASE_URL%

REM Clear screen
cls

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     THE HENRY WEBSITE - DEPLOYMENT TEST LAUNCHER              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Target URL: %BASE_URL%
echo Timestamp:  %date% %time%
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version
echo.

REM Check if we're in the server directory
if not exist "package.json" (
    echo ❌ ERROR: package.json not found
    echo.
    echo Please run this script from the server directory:
    echo   cd server
    echo   deployment-test.bat
    pause
    exit /b 1
)

echo ⏳ Starting deployment tests...
echo.

REM Run the deployment tests
if "%BASE_URL%"=="http://localhost:3000" (
    node deployment-test.js
) else (
    node deployment-test.js %BASE_URL%
)

set TEST_RESULT=%errorlevel%

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    TEST EXECUTION COMPLETE                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

if %TEST_RESULT% equ 0 (
    echo ✅ SUCCESS: All critical tests passed!
    echo.
    echo The website is ready for deployment.
    echo.
) else (
    echo ❌ FAILURE: Some critical tests failed!
    echo.
    echo Please review the output above and fix any issues.
    echo.
)

echo Press any key to exit...
pause >nul

exit /b %TEST_RESULT%
