@echo off
cd /d "%~dp0"
echo Widgeteers Studio -> http://127.0.0.1:8765/web/
start "" http://127.0.0.1:8765/web/
python -m http.server 8765
