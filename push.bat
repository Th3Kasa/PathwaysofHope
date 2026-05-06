@echo off
cd /d "%~dp0"
git add -A
git commit -m "Update site"
git push origin main
pause
