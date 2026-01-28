@echo off
setlocal

echo ========================================
echo   World of Darkness - Git Push Helper
echo ========================================

echo.
echo [1/4] Statut actuel du repository :
git status -s

echo.
set /p msg="Entrez votre message de commit : "

if "%msg%"=="" (
    echo [ERREUR] Le message de commit ne peut pas etre vide.
    pause
    exit /b
)

echo.
echo [2/4] Ajout et Commit des fichiers...
git add .
git commit -m "%msg%"

echo.
echo [3/4] Push vers GitHub (origin main)...
git push origin main

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERREUR] Le push a echoue. Verifiez votre connexion ou les conflits.
    pause
    exit /b
)

echo.
echo [4/4] Deploiement sur Fly.io...
fly deploy

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERREUR] Le deploiement Fly.io a echoue.
) else (
    echo.
    echo [SUCCES] Modifications poussees et deployees avec succes !
)

echo.
pause

