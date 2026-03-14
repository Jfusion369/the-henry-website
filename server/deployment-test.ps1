#!/usr/bin/env powershell
<#
.SYNOPSIS
    Deployment Test Suite Runner for The Henry Website
    
.DESCRIPTION
    Runs comprehensive functional tests on website deployment
    
.PARAMETER BaseUrl
    URL to test (default: http://localhost:3000)
    
.EXAMPLE
    .\deployment-test.ps1
    .\deployment-test.ps1 -BaseUrl "https://thehenry.com"
    .\deployment-test.ps1 "https://staging.thehenry.com"
    
.NOTES
    Version: 1.0
    Author: The Henry Website Team
#>

param(
    [Parameter(Position=0)]
    [string]$BaseUrl = "http://localhost:3000"
)

# Set error action
$ErrorActionPreference = "Continue"

# Clear screen
Clear-Host

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     THE HENRY WEBSITE - DEPLOYMENT TEST LAUNCHER              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "Target URL: $BaseUrl"
Write-Host "Timestamp:  $timestamp"
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: package.json not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run this script from the server directory:" -ForegroundColor Yellow
    Write-Host "  cd server" -ForegroundColor Gray
    Write-Host "  .\deployment-test.ps1" -ForegroundColor Gray
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "⏳ Starting deployment tests..." -ForegroundColor Yellow
Write-Host ""

# Run the deployment tests
try {
    if ($BaseUrl -eq "http://localhost:3000") {
        & node deployment-test.js
    } else {
        & node deployment-test.js $BaseUrl
    }
    $testResult = $LASTEXITCODE
} catch {
    Write-Host "❌ ERROR: Failed to run tests: $_" -ForegroundColor Red
    $testResult = 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    TEST EXECUTION COMPLETE                     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($testResult -eq 0) {
    Write-Host "✅ SUCCESS: All critical tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "The website is ready for deployment." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ FAILURE: Some critical tests failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the output above and fix any issues." -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter to exit"
exit $testResult
