#Requires -Version 5.1
<#
.SYNOPSIS
  Preflight MicropolisAngel dev environment on Windows.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

Write-Host "MicropolisAngel dev preflight" -ForegroundColor Cyan
Write-Host ""

function Test-Command($name) {
    if (Get-Command $name -ErrorAction SilentlyContinue) {
        Write-Host "[ok] $name" -ForegroundColor Green
        return $true
    }
    Write-Host "[--] $name not on PATH" -ForegroundColor Yellow
    return $false
}

Test-Command "dotnet" | Out-Null
if (Test-Command "dotnet") {
    & dotnet --version
    $sdks = & dotnet --list-sdks 2>$null
    if ($sdks -match "8\.") {
        Write-Host "[ok] .NET 8 SDK" -ForegroundColor Green
    } else {
        Write-Host "[!!] Install .NET 8 SDK — https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Red
    }
}

Test-Command "git" | Out-Null
Test-Command "node" | Out-Null
Test-Command "pnpm" | Out-Null
Test-Command "ffmpeg" | Out-Null

$wv2 = "${env:ProgramFiles(x86)}\Microsoft\EdgeWebView\Application"
if (Test-Path $wv2) {
    Write-Host "[ok] WebView2 runtime ($wv2)" -ForegroundColor Green
} else {
    Write-Host "[!!] WebView2 runtime — install Evergreen bootstrapper" -ForegroundColor Red
    Write-Host "     https://developer.microsoft.com/microsoft-edge/webview2/"
}

$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (Test-Path $vswhere) {
    $vs = & $vswhere -latest -property displayName 2>$null
    Write-Host "[ok] Visual Studio: $vs" -ForegroundColor Green
    $winui = & $vswhere -latest -requires Microsoft.VisualStudio.Component.WindowsAppSDK -property installationPath 2>$null
    if ($winui) {
        Write-Host "[ok] Windows App SDK workload/component" -ForegroundColor Green
    } else {
        Write-Host "[!!] Install 'Windows App SDK' / WinUI in VS Installer" -ForegroundColor Yellow
    }
} else {
    Write-Host "[!!] Visual Studio 2022 not found — required for XAML designer + WinUI debugging" -ForegroundColor Red
}

$simsPaths = @(
    "${env:ProgramFiles(x86)}\Steam\steamapps\common\The Sims Legacy Collection",
    "${env:ProgramFiles(x86)}\Maxis\The Sims"
)
foreach ($p in $simsPaths) {
    if (Test-Path $p) {
        Write-Host "[ok] Sims path: $p" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Next: dotnet restore && dotnet build in apps\micropolis-angel\native" -ForegroundColor Cyan
Write-Host "Docs: apps\micropolis-angel\WINDOWS-DEV-SETUP.md" -ForegroundColor Cyan
