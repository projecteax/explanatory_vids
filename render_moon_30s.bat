@echo off
setlocal
cd /d "%~dp0explainer"

call npm run render:30
if errorlevel 1 exit /b 1

cd /d "%~dp0"
python tools\build_moon_preview_audio.py
if errorlevel 1 exit /b 1

ffmpeg -y ^
  -i generated\video\moon_explainer_30s_silent.mp4 ^
  -i generated\audio\moon_30s_clean.m4a ^
  -map 0:v:0 -map 1:a:0 ^
  -t 30 -c:v copy -c:a copy ^
  generated\video\moon_explainer_30s.mp4

if errorlevel 1 exit /b 1
echo DONE: generated\video\moon_explainer_30s.mp4
