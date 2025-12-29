@echo off
:: Se placer dans le dossier où se trouve ce fichier .bat
cd /d "%~dp0"

:: Entrer dans le dossier web
cd web

:: Lancer la commande
npm run dev

:: Mettre en pause à la fin pour voir les erreurs si le serveur crash
pause