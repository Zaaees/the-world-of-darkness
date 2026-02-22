@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul

echo ========================================
echo   World of Darkness - Git Push Helper (IA)
echo ========================================

echo.
echo [1/4] Ajout des fichiers...
git add .

echo.
echo [2/4] Generation du message avec Gemini Flash...

if exist .commit_msg.tmp del .commit_msg.tmp

:: Execute le script Node (utilise .env s'il existe pour la cle)
if exist ".env" (
    node --env-file=.env generate_commit.js
) else (
    node generate_commit.js
)

if exist .commit_msg.tmp (
    set /p generated_msg=<.commit_msg.tmp
    del .commit_msg.tmp
) else (
    echo [AVERTISSEMENT] Gemini n'a pas pu generer de message ^(clef API manquante ou erreur^).
    goto :MANUAL_MSG
)

echo.
echo Message propose : "!generated_msg!"
set /p user_msg="Appuyez sur Entree pour valider, ou tapez un autre message : "

if "!user_msg!"=="" (
    set "msg=!generated_msg!"
) else (
    set "msg=!user_msg!"
)
goto :COMMIT

:MANUAL_MSG
echo.
set /p msg="Entrez votre message de commit manuellement : "
if "!msg!"=="" (
    echo [ERREUR] Le message de commit ne peut pas etre vide.
    pause
    exit /b
)

:COMMIT
echo.
echo [3/4] Commit en cours avec le message : "!msg!"...
git commit -m "!msg!"

echo.
echo [4/4] Push vers GitHub (origin main)...
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
