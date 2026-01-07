# Architecture Bot Discord - Stratégie Core/Modules

## Vue d'ensemble (Overview)

L'architecture du bot évolue vers une stratégie **Core/Modules (Noyau/Extension)**. L'objectif est de séparer l'infrastructure technique commune (Core) des logiques de jeu spécifiques aux "Splats" (Vampire, Loup-Garou, Mage, etc.), qui deviennent des **Modules** autonomes.

Cette approche permet :
1. **Scalabilité** : Ajouter un nouveau jeu (Splat) sans toucher au code existant.
2. **Clarté** : Chaque module est isolé avec ses propres commandes, données et vues.
3. **Stabilité** : Le Noyau gère les services critiques (Discord, Base de données, Web) de manière centralisée.

---

## 1. Le Noyau (Core System)

Le **Core** est responsable de l'infrastructure globale. Il ne connaît pas les règles spécifiques de Vampire ou Loup-Garou, mais il fournit les outils pour qu'ils fonctionnent.

### Composants du Core

#### A. Bootstrapper (`main.py`)
- Initialise le bot Discord (`discord.Client`).
- Charge la configuration globale (`.env`, `config.yaml`).
- Lance le **Module Loader**.
- Démarre le serveur Web API (`api_server.py`).

#### B. Module Loader Service
Un nouveau service responsable de la découverte et du chargement dynamique :
- Scanne le dossier `/modules`.
- Lit le fichier `manifest.json` de chaque sous-dossier.
- Charge les extensions (Cogs) déclarées dans le manifeste.
- Vérifie les dépendances (ex: un module "Rituals" qui dépendrait de "Vampire").

#### C. Services Partagés (`utils/`)
- **Database Manager** : Fournit un accès `aiosqlite` thread-safe. Gère les tables "Communes" (ex: table `users` globale liant un ID Discord à un profil de joueur).
- **Event Bus** : Système de publication/abonnement interne permettant aux modules de communiquer sans dépendance directe (ex: le module *Vampire* publie un event `ON_DAMAGE`, le module *Combat* l'écoute).
- **Web Bridge** : Point d'entrée pour les requêtes venant du site web, redirigeant les payloads vers les modules concernés.

---

## 2. Le Système de Modules (Module System)

Un **Module** est un dossier autonome contenant toute la logique pour une fonctionnalité ou un "Splat" (Race) spécifique.

### Structure Standard d'un Module
Tout module doit suivre cette structure stricte pour être chargé par le Core :

```text
modules/
  └── vampire/                 # Nom du dossier = ID du module
      ├── manifest.json        # Fichier de définition (OBLIGATOIRE)
      ├── cogs/                # Commandes Discord (/slash commands)
      │   ├── commands.py
      │   └── admin.py
      ├── events/              # Listeners (on_message, etc.)
      ├── views/               # Interfaces UI (Boutons, Modales)
      ├── models/              # Définitions SQL spécifiques au module
      └── assets/              # Fichiers statiques ou JSON de données
```

### Le Fichier `manifest.json`
Chaque module doit posséder un manifeste décrivant son contenu au Core :

```json
{
  "id": "vampire",
  "name": "Vampire: La Mascarade",
  "version": "1.0.0",
  "description": "Gestion de la Soif, Disciplines et fiches Vampire",
  "entry_points": [
    "cogs.commands",
    "cogs.admin"
  ],
  "dependencies": []
}
```

---

## 3. Flux de Données (Data Flow)

### Initialisation
1. **Core Start** : `main.py` démarre.
2. **Discovery** : Le Core scanne `/modules/*/manifest.json`.
3. **Loading** : Pour chaque module valide, python charge les fichiers listés dans `entry_points` comme extensions Discord (`load_extension`).

### Interaction Utilisateur (Exemple)
1. **User Action** : Le joueur tape `/soif expenser` (Commande du module *Vampire*).
2. **Routing** : Discord route la commande vers le Cog `vampire.cogs.commands`.
3. **Processing** :
   - Le module interroge la DB via le **Core Database Manager**.
   - Il modifie l'état local (Table `vampire_stats` gérée par le module).
4. **Feedback** : Le module répond directement à l'interaction Discord via une Vue (`views/`).

### Cross-Module Communication
Si un module *Mage* a besoin de savoir si un *Vampire* est à proximité :
- Il **NE FAIT PAS** `import modules.vampire`.
- Il écoute ou émet un événement via le **Core Event Bus**, ou interroge une API interne exposée par le Core.

---

## 4. Migration des Données
Les modèles de données actuels (`docs/data-models-bot.md`) devront être séparés :
- **Core Tables** : `users` (User ID, Guild ID, Active Splat).
- **Module Tables** :
    - `module_vampire_data` (Soif, Generation, Clan).
    - `module_werewolf_data` (Rage, Auspice, Tribe).
