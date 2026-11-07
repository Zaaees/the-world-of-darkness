# Monde des Ténèbres - Bot Discord

Assistant narratif pour jeu de rôle écrit basé sur l'univers du Monde des Ténèbres.

## Concept

Ce bot agit comme un **arbitre invisible** qui impose des contraintes narratives aux joueurs pour simuler leur perte d'humanité ou de contrôle. Il ne simule pas de combats ou de jets de dés — il guide le roleplay.

## État du projet

| Module | État |
|--------|------|
| 🩸 Vampire | ✅ Actif — priorité actuelle (bot, site, Vitae, clans, disciplines, goules) |
| 🐺 Loup-Garou | ⏸️ En pause — toujours en service, mais plus développé pour l'instant |

> ⏸️ **Module Loup-Garou en pause** (depuis le 2026-11-07). Le développement se concentre sur le module Vampire. Le code Loup-Garou reste chargé et fonctionnel, mais ne reçoit ni nouvelles fonctionnalités ni refonte tant que la reprise n'est pas décidée.

## Interface

Le bot utilise des **slash commands** avec des **panneaux interactifs** :
- `/vampire` — Ouvre le panneau Vampire (boutons pour gérer la Soif)
- `/lycan` — Ouvre le panneau Loup-Garou (boutons pour gérer la Rage)

Les panneaux sont **éphémères** (visibles uniquement par le joueur qui les invoque).

## Restrictions par Rôle

- `/vampire` : Nécessite le rôle **"Vampire"** sur le serveur
- `/lycan` : Nécessite le rôle **"Loup-garou"** sur le serveur

## Système Vampire : La Soif et les Compulsions

Simule l'addiction au sang et l'influence du Clan ancestral.

- **Soif** : Jauge de 0 à 5, persistante entre les scènes
- **Compulsions** : Messages privés progressifs selon le clan
- **13 Clans** : Brujah, Gangrel, Malkavien, Nosferatu, Toreador, Tremere, Ventrue, Lasombra, Tzimisce, Ravnos, Setite, Giovanni, Banu Haqim
- **Frénésie** : Au niveau 5, la Bête prend le contrôle

### Panneau Vampire

| Bouton | Action |
|--------|--------|
| 🩸 Soif | Augmente la Soif de 1 |
| 🍷 Se nourrir | Restaure complètement la Soif (remet à 0) |

Les compulsions sont affichées directement dans le panneau, avec une intensité progressive selon le niveau de Soif.

## Système Loup-Garou : La Rage et le Maintien (⏸️ en pause)

> ⏸️ **Module Loup-Garou en pause** (depuis le 2026-11-07). Le développement se concentre sur le module Vampire. Le code Loup-Garou reste chargé et fonctionnel, mais ne reçoit ni nouvelles fonctionnalités ni refonte tant que la reprise n'est pas décidée.

Simule la colère sacrée des Garous.

- **Rage** : Jauge liée à une **scène** (salon), seuils à 10 (Enragé) et 20 (Primal)
- **Décroissance automatique** : La rage diminue de 2 à chaque tour
- **Tours** : Détection organique des conversations
- **Maintien** : 2 tours sans augmenter la rage = retour au calme
- **5 Augures** : Ragabash, Theurge, Philodox, Galliard, Ahroun
- **État Primal** : Annonce publique et changement de surnom

### Panneau Lycan

| Bouton | Action |
|--------|--------|
| 💢 +1 Rage | Affront mineur |
| 😠 +2 Rage | Affront modéré |
| 🔥 +3 Rage | Affront majeur |
| 🏁 Fin de scène | Clôture la scène (rage = 0) |

Les messages de Rage (Enragé, Primal) sont affichés directement dans le panneau.

### Mécanique des Tours

Un "tour" se termine quand :
1. Le loup-garou envoie un/des message(s)
2. D'autres personnes répondent
3. Le loup-garou envoie à nouveau un message

À chaque tour :
- La rage diminue automatiquement de 2
- Si en état Enragé sans ajouter de rage, le compteur de maintien augmente
- Après 2 tours sans rage ajoutée, le calme revient

## Installation

### Prérequis

- Python 3.10+
- Un bot Discord avec les intents `Message Content`, `Server Members`, et `Guilds`
- Rôles "Vampire" et "Loup-garou" créés sur le serveur

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
- Gérer les surnoms (pour l'état Primal)
- Utiliser les commandes slash

## Commandes Admin

| Commande | Description |
|----------|-------------|
| `/vampire_config` | Configure un joueur comme Vampire |
| `/lycan_config` | Configure un joueur comme Loup-Garou |
| `/fin_scene` | Met fin à une scène pour tous les lycans |

## Catégories RP

Les commandes ne fonctionnent que dans les catégories contenant **[RP]** dans leur nom :
- `[RP] Centre-Ville`
- `[RP] La Forêt Noire`

Les catégories sans `[RP]` sont considérées HRP (Hors Role-Play).

## Structure du Projet

```
the-world-of-darkness/
├── main.py                 # Point d'entrée
├── requirements.txt        # Dépendances
├── .env.example            # Template de configuration
├── cogs/
│   ├── vampire.py          # Système Vampire (slash command)
│   └── werewolf.py         # Système Loup-Garou (slash command)
├── views/
│   ├── vampire_panel.py    # Panneau interactif Vampire
│   └── lycan_panel.py      # Panneau interactif Lycan
├── data/
│   ├── clans.py            # 13 clans avec compulsions
│   └── auspices.py         # 5 augures avec messages de rage
└── utils/
    ├── database.py         # Persistance SQLite (rage par salon)
    └── rp_check.py         # Vérification catégories [RP]
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
