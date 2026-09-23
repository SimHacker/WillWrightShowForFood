echo off
:start
if exist menuopt.bat del menuopt.bat
menu
if not errorlevel 9 goto end
menuopt
goto start
:end