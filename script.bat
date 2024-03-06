@echo off
setlocal enabledelayedexpansion

REM Get IPv4 address of wireless LAN adapter
set "ipv4_address="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /R /C:"Wireless LAN Adapter" /C:"IPv4 Address"') do (
    set "line=%%a"
    set "line=!line:IPv4 Address=!"
    set "ipv4_address=!line:~1!"
)

REM Update .env file with the IP address
set "env_file=.env"
set "ip_key=VITE_IP_ADDRESS"

for /f "delims=" %%i in ('type "%env_file%" ^& break ^> "%env_file%"') do (
    set "line=%%i"
    if "!line:%ip_key%=!" neq "!line!" (
        echo %ip_key%=%ipv4_address%>> "%env_file%"
    ) else (
        echo %%i>> "%env_file%"
    )
)

REM Run npm start
npm run dev -- --host

endlocal
