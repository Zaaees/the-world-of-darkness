@echo off
setlocal

echo ========================================
echo   World of Darkness - Git Push Helper
echo ========================================

echo.
echo [1/3] Statut actuel du repository :
git status -s

echo.
set /p msg="Entrez votre message de commit : "

if "%msg%"=="" (
    echo [ERREUR] Le message de commit ne peut pas etre vide.
    pause
    exit /b
)

echo.
echo [2/3] Ajout et Commit des fichiers...
git add .
git commit -m "%msg%"

echo.
echo [3/3] Push vers GitHub (origin main)...
git push origin main

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERREUR] Le push a echoue. Verifiez votre connexion ou les conflits.
) else (
    echo.
    echo [SUCCES] Modifications poussees avec succes !
)

echo.
pause


