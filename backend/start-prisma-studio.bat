@echo off
echo Starting Prisma Studio...
echo.
echo This will open your database in a browser at http://localhost:5555
echo.
cd /d E:\c2c\backend
start cmd /k "npm run prisma:studio"
echo.
echo Prisma Studio is starting...
pause
