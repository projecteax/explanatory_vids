@echo off
cd /d "%~dp0.."
echo === Widgeteers / ElevenLabs Moon dialogue ===
if not exist ".env" (
  echo Brak pliku .env — tworze z przykladu...
  copy /Y .env.example .env >nul
)
findstr /C:"sk_PASTE" .env >nul
if %ERRORLEVEL%==0 (
  echo.
  echo Otworz plik:  %cd%\.env
  echo Wklej swoj klucz:  ELEVENLABS_API_KEY=sk_...
  echo Zapisz i odpal ten bat ponownie.
  echo.
  notepad .env
  pause
  exit /b 1
)
python -c "import elevenlabs" 2>nul || pip install --user elevenlabs python-dotenv
python tools\elevenlabs_moon_dialogue.py --generate
echo.
echo MP3: generated\audio\moon_why_moon_changes_shape.mp3
pause
