@echo off
setlocal EnableExtensions

echo Starting Space-Based Architecture Flash Sale System...

:: Always run from repo root (folder containing this .bat)
cd /d "%~dp0"

:: Wait for services to be ready
echo Waiting for services...
powershell -NoProfile -Command "Start-Sleep -Seconds 5"

:: Set DB connection environment variables for local running (MariaDB is running locally)
set "DB_HOST=localhost"
set "DB_USER=root"
set "DB_PASSWORD=sapassword"
set "DB_NAME=flash_sale"

:: Seed Data
echo Seeding data...
pushd scripts
npm install ioredis
node seed.js
popd

:: Start PUs (in separate windows)
echo Starting Processing Units...
start "PU1 - Product" cmd /k "cd /d backend\pu1-product && npm install && node index.js"
start "PU2 - Cart" cmd /k "cd /d backend\pu2-cart && npm install && node index.js"
start "PU3 - Order" cmd /k "cd /d backend\pu3-order && npm install && node index.js"
start "PU4 - Inventory" cmd /k "cd /d backend\pu4-inventory && npm install && node index.js"
start "PU-Persistence" cmd /k "cd /d backend\pu-persistence && npm install && node index.js"
start "PU-Read" cmd /k "cd /d backend\pu-read && npm install && node index.js"

:: Start Frontend
echo Starting Frontend...
pushd frontend
npm install
npm run dev
popd
endlocal