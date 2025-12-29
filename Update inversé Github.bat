e@echo off
title Pull depuis GitHub
color 0B

echo ---------------------------------------------------
echo  MISE A JOUR LOCALE DEPUIS GITHUB
echo ---------------------------------------------------
echo.

echo ---------------------------------------------------
echo  Execution des commandes Git...
echo ---------------------------------------------------

:: 1. Fetch les derniers changements
echo [1/3] git fetch
git fetch

:: 2. Affiche les differences avec la branche distante
echo.
echo Differences avec la branche distante :
git diff HEAD..origin/HEAD --stat
echo.

:: 3. Pull les changements
echo [2/3] git pull
git pull

echo.
echo ---------------------------------------------------
echo  Termine !
echo ---------------------------------------------------
pause
