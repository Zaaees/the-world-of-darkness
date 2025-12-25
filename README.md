# Monde des Ténèbres - Bot Discord

Assistant narratif pour jeu de rôle écrit basé sur l'univers du Monde des Ténèbres.

## Concept

Ce bot agit comme un **arbitre invisible** qui impose des contraintes narratives aux joueurs pour simuler leur perte d'humanité ou de contrôle. Il ne simule pas de combats ou de jets de dés — il guide le roleplay.

## Fonctionnalités

### Système Vampire : La Soif et les Compulsions

Simule l'addiction au sang et l'influence du Clan ancestral.

- **Soif** : Jauge de 0 à 5
- **Compulsions** : Messages privés progressifs selon le clan
- **13 Clans** : Brujah, Gangrel, Malkavien, Nosferatu, Toreador, Tremere, Ventrue, Lasombra, Tzimisce, Ravnos, Setite, Giovanni, Banu Haqim
- **Frénésie** : Au niveau 5, la Bête prend le contrôle

### Système Loup-Garou : La Rage et le Maintien

Simule la colère sacrée des Garous.

- **Rage** : Jauge sans limite, seuils à 10 (Enragé) et 20 (Primal)
- **Tours de Parole** : Détection organique des conversations
- **Maintien** : 2 tours pour se calmer ou nourrir la Rage
- **5 Augures** : Ragabash, Theurge, Philodox, Galliard, Ahroun
- **État Primal** : Annonce publique et changement de surnom

## Installation

### Prérequis

- Python 3.10+
- Un bot Discord avec les intents `Message Content`, `Server Members`, et `Guilds`

### Installation

```bash
# Cloner le repository
git clone <repo-url>
cd the-world-of-darkness

# Installer les dépendances
pip install -r requirements.txt

# Configurer le bot
cp .env.example .env
# Éditer .env avec votre token Discord

# Lancer le bot
python main.py
```

### Permissions Discord requises

- Lire les messages
- Envoyer des messages
- Gérer les messages (suppression)
- Gérer les surnoms (optionnel, pour l'état Primal)

## Commandes

### Configuration

| Commande | Description |
|----------|-------------|
| `!config` | Affiche l'aide de configuration |
| `!config vampire <clan>` | Configure comme Vampire |
| `!config garou <augure>` | Configure comme Loup-Garou |
| `!config profil [@user]` | Affiche un profil |
| `!config reset` | Supprime son personnage |
| `!config clans` | Liste les clans vampiriques |
| `!config augures` | Liste les augures |

### Vampire

| Commande | Description |
|----------|-------------|
| `!sang` | Augmente la Soif (+1), reçoit une Compulsion en MP |
| `!boire [n]` | Réduit la Soif |
| `!soif` | Affiche le niveau de Soif (MP) |

### Loup-Garou

| Commande | Description |
|----------|-------------|
| `!rage [n]` | Augmente la Rage |
| `!calme [n]` | Réduit la Rage |
| `!ragestat` | Affiche le niveau de Rage (MP) |

### Administration

| Commande | Description |
|----------|-------------|
| `!setsoif @user <n>` | Définit la Soif d'un vampire |
| `!setrage @user <n>` | Définit la Rage d'un garou |

## Catégories RP

Les commandes `!sang` et `!rage` ne fonctionnent que dans les catégories contenant **[RP]** dans leur nom. Exemple :
- `[RP] Centre-Ville`
- `[RP] La Forêt Noire`

Les catégories sans `[RP]` sont considérées HRP (Hors Role-Play).

## Structure du Projet

```
the-world-of-darkness/
├── main.py              # Point d'entrée
├── requirements.txt     # Dépendances
├── .env.example        # Template de configuration
├── cogs/
│   ├── vampire.py      # Système Vampire
│   ├── werewolf.py     # Système Loup-Garou
│   └── config.py       # Configuration joueur
├── data/
│   ├── clans.py        # Définitions des clans
│   └── auspices.py     # Définitions des augures
└── utils/
    ├── database.py     # Persistance SQLite
    └── rp_check.py     # Vérification canaux RP
```

## Extensibilité

### Ajouter un Clan

Éditer `data/clans.py` et ajouter une entrée dans le dictionnaire `CLANS` :

```python
"nouveau_clan": {
    "nom": "Nouveau Clan",
    "description": "Description du clan",
    "compulsions": {
        1: {"nom": "...", "description": "...", "directive": "..."},
        # ... niveaux 2-5
    }
}
```

### Ajouter un Augure

Éditer `data/auspices.py` et ajouter une entrée dans le dictionnaire `AUSPICES`.

## Licence

Monde des Ténèbres, Vampire: The Masquerade et Werewolf: The Apocalypse sont des marques déposées de Paradox Interactive / White Wolf Entertainment.

Ce bot est un projet fan non officiel à but non lucratif.
