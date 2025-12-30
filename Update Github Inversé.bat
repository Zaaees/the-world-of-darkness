@echo off
title Git Force Update
color 0E

:: --- CONFIGURATION ---
set "DOSSIER_CIBLE=C:\Chemin\Vers\Ton\Projet"
:: Indique ici le nom de la branche principale (main ou master)
set "BRANCHE=main"

echo.
echo [ATTENTION] CECI VA EFFACER TES MODIFICATIONS LOCALES
echo.
pause

cd /d "%DOSSIER_CIBLE%"

echo.
echo 1. Telechargement des meta-donnees...
git fetch --all

echo 2. Reinitialisation forcee sur origin/%BRANCHE%...
git reset --hard origin/%BRANCHE%

echo.
echo Termine. Le dossier est strictement identique au serveur.
pause