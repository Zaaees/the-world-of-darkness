# CLAUDE.md - Configuration du Projet

# Commandes de Build & Test
# Claude utilise ces commandes pour vérifier son travail en autonomie.
build: npm run build  # Pour le web
test: pytest && npm test # Pour le bot et le web
lint: flake8 . && npm run lint # Pour la qualité du code
server: python main.py # Commande pour lancer le bot (attention au blocage)

# Architecture & Stack
- **Bot Discord**: Python 3.11+, Discord.py 2.0+ (Cogs structure).
- **Web**: React, TailwindCSS.
- **Base de données**: PostgreSQL (asyncpg). Partagée entre le Bot et le Web.

# RÈGLES DE CODAGE (Strictes)

## 1. Discord Bot (Python)
- **Token**: Ne JAMAIS écrire le token en dur. Utilise `os.getenv("DISCORD_TOKEN")`.
- **Cogs**: Tout nouveau module doit être un "Cog" dans le dossier `/cogs`. Pas de code spaghetti dans `main.py`.
- **Imports**: Vérifie toujours les imports circulaires.
- **Logs**: Utilise le module `logging`, pas de `print()`.

## 2. Web (Frontend)
- **Composants**: Un composant = Un fichier.
- **Style**: Utilise TailwindCSS. Pas de CSS inline sauf exception majeure.
- **Mobile**: Vérifie toujours la vue mobile (responsive).

## 3. Comportement de l'Agent
- **Vérification**: Avant de confirmer une tâche, lance la commande `lint`.
- **Erreurs**: Si une erreur survient, lis la StackTrace, cherche la ligne exacte, et corrige. Ne demande pas l'aide de l'utilisateur sauf blocage total.
- **Git**: Ne touche pas à la config Git (.gitignore), contente-toi du code source.