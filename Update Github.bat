@echo off
title Push vers GitHub
color 0A

echo ---------------------------------------------------
echo  MISE A JOUR GITHUB
echo ---------------------------------------------------
echo.

:: 1. Affiche les fichiers modifies
echo Fichiers modifies :
git status -s
echo.

:: 2. Demande le message du commit
set /p commit_msg="Entrez le message du commit (ou Entree pour defaut) : "

:: 3. Si le message est vide, on met un message par defaut
if "%commit_msg%"=="" set commit_msg="Mise a jour automatique"

echo.
echo ---------------------------------------------------
echo  Execution des commandes Git...
echo ---------------------------------------------------

:: 4. Ajout de tous les fichiers
echo [1/3] git add .
git add .

:: 5. Commit
echo [2/3] git commit
git commit -m "%commit_msg%"

:: 6. Push
echo [3/3] git push
git push

echo.
echo ---------------------------------------------------
echo  Termine !
echo ---------------------------------------------------
pause