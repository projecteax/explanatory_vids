@echo off
cd /d "%~dp0explainer"
call npx remotion render MoonExplainer ..\generated\video\moon_silent.mp4 --codec h264
if errorlevel 1 exit /b 1
ffmpeg -y -i ..\generated\video\moon_silent.mp4 -i ..\generated\audio\moon_why_moon_changes_shape.mp3 -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest ..\generated\video\moon_why_moon_changes_shape.mp4
echo DONE: generated\video\moon_why_moon_changes_shape.mp4
