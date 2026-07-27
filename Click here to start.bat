@echo off
REM ---------------------------------------------------------------
REM  This file must stay pure ASCII: cmd.exe mis-parses .bat files
REM  that contain non-ASCII bytes (its reader seeks by byte offset
REM  and desyncs mid-line). Chinese text lives in docs\*.txt, which
REM  is printed with `type` and never parsed as commands.
REM ---------------------------------------------------------------
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title MCQ Test - TMUA / MAT / SMC

set "PORT=3210"
set "URL=http://localhost:%PORT%"

echo.
echo ============================================
echo    MCQ Test  -  TMUA / MAT / SMC
echo ============================================
echo.

REM ---------- 1. Node.js ----------
where node >nul 2>&1
if errorlevel 1 (
  type "docs\help-install-node.txt"
  echo.
  start "" "https://nodejs.org/zh-cn"
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do set "NODEVER=%%v"
echo [1/3] Node.js %NODEVER% OK

REM ---------- 2. Build if needed ----------
REM  A shipped package already contains out\, so this whole branch is
REM  skipped and no npm install / build / internet is ever needed.
if exist "out\index.html" (
  echo [2/3] Prebuilt site found, no setup needed
  goto :serve
)

echo [2/3] No prebuilt site, building from source ^(needs internet, 2-7 min^)
REM  Sentinel is the .bin shim, not next\package.json: an install that was
REM  interrupted half way leaves the package dir behind without the shim,
REM  and skipping reinstall in that state fails later with a confusing
REM  "'next' is not recognized" at build time.
if not exist "node_modules\.bin\next.cmd" (
  echo       Downloading dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    type "docs\help-install-failed.txt"
    echo.
    pause
    exit /b 1
  )
)
echo       Building...
call npm run build
if errorlevel 1 (
  echo.
  type "docs\help-build-failed.txt"
  echo.
  pause
  exit /b 1
)

:serve
echo [3/3] Starting server at %URL%
echo.
type "docs\help-running.txt"
echo.
if not "%~1"=="-nobrowser" start "" cmd /c "timeout /t 3 >nul & start %URL%"
node scripts\serve.mjs

echo.
echo Server stopped.
pause
