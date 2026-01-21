---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - "prd.md"
  - "architecture.md"
  - "ux-design-specification.md"
---

# the-world-of-darkness - Epic Breakdown

## Overview

Ce document décompose les exigences du PRD, de l'Architecture et de l'UX Design du module Loup-Garou en epics et stories implémentables. L'objectif est de créer une expérience parallèle au module Vampire existant.

## Requirements Inventory

### Functional Requirements

**Accès & Identité (Routing)**
- FR1: L'Utilisateur ayant le rôle Discord `Werewolf` accède automatiquement à l'interface Garou à la connexion.
- FR2: L'Utilisateur PERDANT le rôle `Werewolf` perd immédiatement l'accès au site (Déconnexion ou Redirection).
- FR3: L'Utilisateur définit ses attributs immuables (Race, Auspice, Tribu) UNIQUEMENT lors de l'Onboarding initial. Ces données ne sont pas modifiables sur la fiche.

**Fiche Personnage (The Writer's Desk)**
- FR4: L'Utilisateur peut éditer librement le contenu narratif de sa fiche (Histoire, Description, Nom) à tout moment.
- FR5: Le Système publie automatiquement la première version de la fiche dans le Forum Discord dédié (`1462941781761986732`).
- FR6 (Live Sync): Le Système met à jour le contenu du post Discord original à chaque sauvegarde de la fiche sur le site.
- FR7 (Audit Log): Le Système poste un rapport de changement (Diff/Log) dans le Canal de Logs dédié (`1457856977660022844`) pour chaque modification validée.

**Progression & Dons**
- FR8: L'Utilisateur peut soumettre une demande de Renommée (Texte standard).
- FR9: Le MJ peut valider une demande de Renommée, ce qui met à jour le Rang de l'utilisateur.
- FR10: Le MJ peut débloquer des Dons spécifiques pour un utilisateur.
- FR11: L'Utilisateur peut consulter la liste de ses Dons débloqués (Lecture Seule).

**Visibilité**
- FR12: L'Utilisateur ne peut voir QUE sa propre fiche sur le site (Pas d'accès aux brouillons des autres).

### NonFunctional Requirements

**Performance**
- NFR1: Le basculement de contexte (Switch Rôle Vampire <-> Garou) doit s'effectuer en moins de 2 secondes.
- NFR2: Les fonds d'écran et ambiances doivent être pré-chargés ou optimisés pour ne pas ralentir le chargement.

**Fiabilité**
- NFR3 (Mode Dégradé): En cas de panne de l'API Discord, l'accès au site reste possible en Lecture Seule.
- NFR4 (Data Integrity): Les données "Vérité Terrain" sont stockées en base de données locale, Discord n'est qu'un miroir.

**Sécurité**
- NFR5 (Role Sealing): Le middleware de vérification des rôles doit être exécuté côté serveur (Backend) à chaque requête API sensible.

### Additional Requirements

**Architecture (Starter Template & Structure)**
- ARCH1: Utilisation du Monorepo existant (Vampire Code Base). Pas de nouvelle init.
- ARCH2: Structure Backend: `modules/werewolf/` avec `cogs/`, `models/`, `services/`, `views/`, `assets/`.
- ARCH3: Structure Frontend: `web/src/modules/werewolf/` avec `components/`, `pages/`, `hooks/`, `assets/`.
- ARCH4: Pattern API: Routes montées sur `/api/modules/werewolf/*`.
- ARCH5: Zero-Trust: Vérification rôle Discord côté Backend à chaque requête.
- ARCH6: Isolation stricte: Pas d'import croisé entre modules Vampire et Werewolf.

**UX Design (Composants & Thème)**
- UX1: Thème "Deep Woods" - Palette: Noyer Sombre (#1a110a), Or Antique (#C19A6B), Blanc Os (#E8DCC5).
- UX2: Composant custom `GiftCard` pour afficher les Dons (États: Verrouillé/Débloqué).
- UX3: Composant custom `RenownBadge` pour afficher la progression du rang.
- UX4: Composant custom `StoryEditor` pour l'édition narrative (Auto-save, mode Focus).
- UX5: Responsive Mobile First avec Bottom Nav sur écrans < 768px.
- UX6: Accessibilité WCAG AA - Contraste minimum 13:1 pour texte corps.

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Accès automatique interface Garou via rôle Discord |
| FR2 | Epic 1 | Perte d'accès si perte du rôle Werewolf |
| FR3 | Epic 2 | Définition attributs immuables à l'onboarding |
| FR4 | Epic 3 | Édition libre du contenu narratif de la fiche |
| FR5 | Epic 2 | Publication automatique première version sur Discord |
| FR6 | Epic 3 | Live Sync: mise à jour du post Discord à chaque sauvegarde |
| FR7 | Epic 3 | Audit Log des modifications dans canal dédié |
| FR8 | Epic 4 | Soumission demande de Renommée par le joueur |
| FR9 | Epic 4 | Validation Renommée par MJ → Mise à jour Rang |
| FR10 | Epic 5 | Déblocage de Dons spécifiques par le MJ |
| FR11 | Epic 5 | Consultation liste des Dons débloqués |
| FR12 | Epic 1 | Visibilité fiche privée (joueur voit uniquement la sienne) |

## Epic List

### Epic 1: Fondation & Accès Garou 🏗️

L'utilisateur Werewolf peut accéder au site et naviguer dans l'interface dédiée avec le thème "Deep Woods".

**FRs couverts:** FR1, FR2, FR12
**Exigences additionnelles:** ARCH1-6, UX1, NFR1, NFR5

---

### Epic 2: Onboarding - Premier Changement 🐺

Le nouveau joueur peut créer son personnage Garou avec ses attributs fondamentaux (Race, Auspice, Tribu) et sa fiche initiale est automatiquement publiée sur Discord.

**FRs couverts:** FR3, FR5
**Exigences additionnelles:** UX4

---

### Epic 3: Fiche Personnage - Le Bureau de l'Écrivain ✍️

Le joueur peut consulter et éditer librement sa fiche narrative avec synchronisation automatique vers Discord et traçabilité des modifications.

**FRs couverts:** FR4, FR6, FR7
**Exigences additionnelles:** UX4, NFR2, NFR3, NFR4

---

### Epic 4: Hauts Faits - La Gloire 🏆

Le joueur peut soumettre ses accomplissements pour validation par le MJ, ce qui fait progresser son Rang (Renommée).

**FRs couverts:** FR8, FR9
**Exigences additionnelles:** UX3

---

### Epic 5: Dons - Les Secrets de Gaïa 🎁

Le joueur peut consulter ses Dons débloqués par le MJ, enrichissant ses possibilités narratives.

**FRs couverts:** FR10, FR11
**Exigences additionnelles:** UX2

---

## Epic 1: Fondation & Accès Garou 🏗️

L'utilisateur Werewolf peut accéder au site et naviguer dans l'interface dédiée avec le thème "Deep Woods".

### Story 1.1: Structure du Module Werewolf

As a développeur,
I want la structure de dossiers du module Werewolf créée selon l'architecture définie,
So that je puisse développer les fonctionnalités frontend et backend de manière isolée.

**Acceptance Criteria:**

**Given** le monorepo existant
**When** je crée la structure du module werewolf
**Then** `modules/werewolf/` existe avec `__init__.py`, `manifest.json`, et les sous-dossiers `cogs/`, `models/`, `services/`, `views/`, `assets/`
**And** `web/src/modules/werewolf/` existe avec `index.js`, `routes.jsx`, et les sous-dossiers `components/`, `pages/`, `hooks/`, `assets/`

---

### Story 1.2: Thème "Deep Woods" CSS

As a joueur Loup-Garou,
I want une interface visuelle thématique "Forêt Profonde",
So that je me sente immergé dans l'univers Garou dès la connexion.

**Acceptance Criteria:**

**Given** le fichier `werewolf-theme.css` créé
**When** le thème Werewolf est activé
**Then** la palette appliquée utilise : Noyer Sombre (#1a110a), Or Antique (#C19A6B), Blanc Os (#E8DCC5)
**And** le contraste texte/fond respecte WCAG AA (ratio ≥ 4.5:1)

---

### Story 1.3: Middleware de Vérification de Rôle Discord

As a système,
I want vérifier le rôle Discord `Werewolf` (ID: `1453870972376584192`) côté serveur,
So that seuls les joueurs autorisés accèdent aux routes `/api/modules/werewolf/*`.

**Acceptance Criteria:**

**Given** un utilisateur connecté via Discord OAuth
**When** il appelle une route `/api/modules/werewolf/*`
**Then** le middleware vérifie la présence du rôle `1453870972376584192` dans son profil Discord
**And** si absent, retourne une erreur 403 avec message "Vous n'entendez pas l'appel de Gaïa"

---

### Story 1.4: Routing Frontend Conditionnel

As a joueur avec le rôle Werewolf,
I want être automatiquement redirigé vers l'interface Garou à la connexion,
So that je n'aie pas à naviguer manuellement.

**Acceptance Criteria:**

**Given** un utilisateur ayant le rôle Discord `Werewolf`
**When** il se connecte au site
**Then** il est redirigé vers `/werewolf/dashboard` (ou sa fiche)
**And** la navigation affiche le thème "Deep Woods"
**And** il ne voit que les menus Werewolf (pas Vampire)

---

### Story 1.5: Protection des Routes - Accès Refusé

As a joueur Vampire (sans rôle Werewolf),
I want être bloqué si j'essaie d'accéder aux pages Werewolf,
So that la séparation des univers soit maintenue.

**Acceptance Criteria:**

**Given** un utilisateur SANS le rôle Discord `Werewolf`
**When** il tente d'accéder à `/werewolf/*`
**Then** il est redirigé vers sa fiche Vampire OU une page 403
**And** le message affiché est thématique (ex: "Vous n'entendez pas l'appel de Gaïa")

---

## Epic 2: Onboarding - Premier Changement 🐺

Le nouveau joueur peut créer son personnage Garou avec ses attributs fondamentaux (Race, Auspice, Tribu) et sa fiche initiale est automatiquement publiée sur Discord.

### Story 2.1: Modèle de Données Werewolf

As a système,
I want une table `werewolf_data` en base de données,
So that les données des personnages Garou soient stockées de manière persistante.

**Acceptance Criteria:**

**Given** le module werewolf initialisé
**When** je crée la table `werewolf_data`
**Then** elle contient les colonnes : `user_id` (FK), `breed` (Race), `auspice`, `tribe` (Tribu), `name`, `story` (Histoire), `rank`, `discord_thread_id`, `created_at`, `updated_at`
**And** les champs `breed`, `auspice`, `tribe` sont marqués comme immuables après création

---

### Story 2.2: Assets de Données Garou (Races, Auspices, Tribus)

As a développeur,
I want les données statiques des Races, Auspices et Tribus disponibles en JSON,
So that le formulaire d'onboarding puisse les afficher dynamiquement.

**Acceptance Criteria:**

**Given** le fichier `assets/werewolf_data.json` créé
**When** je le charge
**Then** il contient les listes : `breeds` (Homid, Metis, Lupus), `auspices` (Ragabash, Theurge, Philodox, Galliard, Ahroun), `tribes` (liste complète des 13 tribus)
**And** chaque entrée a un `id`, `name_fr`, et optionnellement `description`

---

### Story 2.3: Formulaire de Création de Personnage

As a nouveau joueur Loup-Garou,
I want un formulaire pour définir mon personnage (Race, Auspice, Tribu, Nom),
So that mon identité narrative soit établie dès ma première connexion.

**Acceptance Criteria:**

**Given** un joueur Werewolf sans fiche existante
**When** il accède à `/werewolf/create`
**Then** il voit un formulaire avec : Sélecteur Race, Sélecteur Auspice, Sélecteur Tribu, Champ Nom de personnage
**And** tous les champs sont obligatoires
**And** le formulaire utilise le thème "Deep Woods"
**And** un avertissement indique que ces choix sont définitifs

---

### Story 2.4: Création de la Fiche en Base de Données

As a joueur,
I want que mes choix soient sauvegardés à la validation du formulaire,
So that ma fiche soit créée et je puisse y accéder ultérieurement.

**Acceptance Criteria:**

**Given** un formulaire d'onboarding rempli et validé
**When** je soumets le formulaire
**Then** une entrée est créée dans `werewolf_data` avec mes attributs
**And** je suis redirigé vers ma fiche (`/werewolf/sheet`)
**And** un toast confirme "Bienvenue dans la Meute, [Nom] !"

---

### Story 2.5: Publication Automatique sur le Forum Discord

As a joueur,
I want que ma fiche soit automatiquement postée sur Discord à sa création,
So that les autres membres puissent la découvrir.

**Acceptance Criteria:**

**Given** une nouvelle fiche créée en base de données
**When** le système publie sur Discord
**Then** un nouveau thread est créé dans le Forum ID `1462941781761986732`
**And** le titre du thread est le nom du personnage
**And** le contenu inclut : Nom, Race, Auspice, Tribu (formaté en Embed Discord)
**And** l'ID du thread est sauvegardé dans `werewolf_data.discord_thread_id`

---

## Epic 3: Fiche Personnage - Le Bureau de l'Écrivain ✍️

Le joueur peut consulter et éditer librement sa fiche narrative avec synchronisation automatique vers Discord et traçabilité des modifications.

### Story 3.1: Page de Consultation de la Fiche

As a joueur Loup-Garou,
I want consulter ma fiche personnage sur une page dédiée,
So that je puisse voir toutes mes informations narratives en un coup d'œil.

**Acceptance Criteria:**

**Given** un joueur avec une fiche existante
**When** il accède à `/werewolf/sheet`
**Then** il voit : Nom, Race, Auspice, Tribu (lecture seule), Histoire (éditable), Rang actuel
**And** la page utilise le thème "Deep Woods"
**And** le composant RenownBadge affiche son rang visuel

---

### Story 3.2: Composant StoryEditor (Édition Narrative)

As a joueur,
I want une zone de texte enrichie pour éditer mon Histoire,
So that je puisse rédiger un récit immersif sans perdre mon travail.

**Acceptance Criteria:**

**Given** la fiche en mode édition
**When** je tape dans le StoryEditor
**Then** le texte est automatiquement sauvegardé toutes les 5 secondes (auto-save)
**And** un indicateur visuel confirme "Sauvegardé" ou "En cours de sauvegarde..."
**And** un mode Focus (plein écran) est disponible

---

### Story 3.3: Synchronisation Discord (Live Sync)

As a joueur,
I want que ma fiche soit mise à jour sur Discord à chaque sauvegarde,
So that les autres membres voient toujours la version la plus récente.

**Acceptance Criteria:**

**Given** une fiche modifiée et sauvegardée
**When** le système synchronise vers Discord
**Then** le contenu du thread existant (`discord_thread_id`) est mis à jour avec le nouveau contenu
**And** un toast confirme "Synchronisé avec Discord"

---

### Story 3.4: Audit Log des Modifications

As a MJ,
I want un historique des modifications de chaque fiche,
So that je puisse suivre l'évolution des personnages.

**Acceptance Criteria:**

**Given** une modification validée sur une fiche
**When** le système génère l'audit log
**Then** un message est posté dans le canal `1457856977660022844`
**And** le message contient : Nom du joueur, Date/Heure, Résumé des changements (diff simplifié)

---

## Epic 4: Hauts Faits - La Gloire 🏆

Le joueur peut soumettre ses accomplissements pour validation par le MJ, ce qui fait progresser son Rang (Renommée).

### Story 4.1: Modèle de Données Renommée

As a système,
I want une table `werewolf_renown` en base de données,
So that les demandes de Hauts Faits soient stockées et suivies.

**Acceptance Criteria:**

**Given** le module werewolf initialisé
**When** je crée la table `werewolf_renown`
**Then** elle contient : `id`, `user_id` (FK), `title`, `description`, `renown_type` (Glory/Honor/Wisdom), `status` (pending/approved/rejected), `submitted_at`, `validated_at`, `validated_by`

---

### Story 4.2: Formulaire de Soumission de Haut Fait

As a joueur,
I want soumettre un Haut Fait pour validation,
So that mes accomplissements narratifs soient reconnus.

**Acceptance Criteria:**

**Given** un joueur sur sa fiche
**When** il clique sur "Ajouter un Haut Fait"
**Then** un modal s'ouvre avec : Champ Titre, Champ Description, Sélecteur Type (Gloire/Honneur/Sagesse)
**And** à la soumission, le statut est "En attente"
**And** un toast confirme "Envoyé aux Esprits (MJ)"

---

### Story 4.3: Dashboard MJ - Liste des Demandes de Renommée

As a MJ,
I want voir toutes les demandes de Hauts Faits en attente,
So that je puisse les valider ou les rejeter.

**Acceptance Criteria:**

**Given** un utilisateur avec le rôle MJ (`1462941982161764556`)
**When** il accède à `/werewolf/admin/renown`
**Then** il voit la liste des demandes avec : Nom joueur, Titre, Type, Date de soumission
**And** chaque entrée a des boutons "Valider" et "Rejeter"

---

### Story 4.4: Validation et Mise à Jour du Rang

As a MJ,
I want valider un Haut Fait et voir le rang du joueur évoluer,
So that la progression narrative soit reflétée visuellement.

**Acceptance Criteria:**

**Given** un MJ qui valide un Haut Fait
**When** il clique sur "Valider"
**Then** le statut passe à "approved"
**And** le rang du joueur est recalculé selon les règles de Renommée
**And** le joueur reçoit une notification Discord
**And** le composant RenownBadge reflète le nouveau rang

---

## Epic 5: Dons - Les Secrets de Gaïa 🎁

Le joueur peut consulter ses Dons débloqués par le MJ, enrichissant ses possibilités narratives.

### Story 5.1: Modèle de Données et Assets Dons

As a système,
I want une structure de données pour les Dons,
So that le catalogue et les déblocages soient gérés.

**Acceptance Criteria:**

**Given** le module werewolf initialisé
**When** je crée les structures de Dons
**Then** `assets/gifts_data.json` contient le catalogue complet des Dons avec : `id`, `name_fr`, `tribe`, `level`, `description`, `gnosis_cost`
**And** la table `werewolf_player_gifts` contient : `user_id`, `gift_id`, `unlocked_at`, `unlocked_by`

---

### Story 5.2: Composant GiftCard

As a joueur,
I want voir mes Dons dans un format visuel attractif,
So that je comprenne immédiatement ce qui est disponible ou non.

**Acceptance Criteria:**

**Given** un Don à afficher
**When** le composant GiftCard est rendu
**Then** si verrouillé : fond grisé, icône cadenas, nom masqué ("Don Mystère")
**And** si débloqué : fond doré, détails visibles (Nom, Description, Coût Gnose)
**And** clic sur carte débloquée = modal avec détails complets

---

### Story 5.3: Page de Consultation des Dons

As a joueur,
I want consulter la liste de mes Dons sur une page dédiée,
So that je puisse voir mes capacités narratives disponibles.

**Acceptance Criteria:**

**Given** un joueur sur `/werewolf/gifts`
**When** la page se charge
**Then** il voit une grille de GiftCard avec tous les Dons de sa Tribu
**And** les Dons débloqués sont triés en premier
**And** un filtre par Niveau est disponible

---

### Story 5.4: Dashboard MJ - Déblocage des Dons

As a MJ,
I want débloquer des Dons spécifiques pour un joueur,
So that je puisse récompenser sa progression narrative.

**Acceptance Criteria:**

**Given** un MJ sur `/werewolf/admin/gifts`
**When** il sélectionne un joueur
**Then** il voit la liste des Dons disponibles pour la Tribu du joueur
**And** il peut cocher les Dons à débloquer
**And** à la validation, les Dons apparaissent sur la fiche du joueur
**And** le joueur reçoit une notification Discord
