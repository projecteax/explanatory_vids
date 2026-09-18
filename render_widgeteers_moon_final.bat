@echo off
setlocal
cd /d "%~dp0"

python tools\build_production_assets.py || exit /b 1
python tools\build_full_audio_and_sync.py || exit /b 1
python tools\build_moon_sound_design.py || exit /b 1

cd explainer
call npm run render:final || exit /b 1
cd ..

ffmpeg -y ^
  -i generated\video\widgeteers_moon_final_silent.mp4 ^
  -i explainer\public\audio\moon_final_mix.m4a ^
  -map 0:v:0 -map 1:a:0 ^
  -c:v copy -c:a aac -b:a 192k -shortest ^
  generated\video\widgeteers_moon_final.mp4 || exit /b 1

echo.
echo DONE: generated\video\widgeteers_moon_final.mp4
endlocal
