@echo off
echo Instalando dependencias do Gattaran MCP Server...
cd /d "C:\Users\viniciuscastanho\Desktop\dcc\mcp-servers\gattaran"

:: Remove node_modules antigo
if exist node_modules (
    rmdir /s /q node_modules
)

:: Remove package-lock
if exist package-lock.json (
    del package-lock.json
)

:: Instala dependencias
npm install

echo.
echo Instalacao concluida!
pause
