@echo off
title OmniLux CSV Watcher
cd /d "%~dp0"
echo.
echo  OmniLux CSV Watcher
echo  -------------------
echo  Leave this window open in the background.
echo  Each time you export a new OmniLux CSV to your Downloads folder,
echo  Firestore will be enriched automatically.
echo.
echo  Press Ctrl+C to stop.
echo.
node scripts/watchAndEnrich.mjs
pause
