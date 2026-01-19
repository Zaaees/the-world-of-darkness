---
stepsCompleted: [1, 2, 3, 4, 6, 7, 8, 9, 10]
inputDocuments: [
  "f:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/_bmad-output/analysis/brainstorming-session-2026-01-13.md"
]
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
workflowType: 'prd'
lastStep: 10
---

# Product Requirements Document - the-world-of-darkness

**Author:** Zaès
**Date:** 2026-01-19

## 1. Executive Summary

Ce projet vise à implémenter le module **Loup-Garou (Werewolf)** (Role ID: `1453870972376584192`) au sein de l'application web existante *World of Darkness*, complétant l'implémentation actuelle (Vampire). L'objectif est de créer une expérience parallèle complète : le site détecte le rôle Discord de l'utilisateur et bascule sur l'interface appropriée.

**Stratégie de Développement :** Utilisation intensive des composants et de l'infrastructure existante du module Vampire (Auth, Discord Bot, Layouts), adaptée aux spécificités **narratives et d'ambiance** des Garous.

**Contrainte Linguistique :** L'intégralité du contenu textuel (UI, Lore, Messages Discord générés) doit être en **Français**.

L'extension se compose de 4 modules interconnectés :

1.  **Création Unique (Onboarding) :** Formulaire unique à l'inscription assignant les Rôles Discord (Race, Auspice, Tribu). Réutilise le moteur de formulaire existant.
2.  **Fiche Personnage (Sheet) :** Interface de rédaction narrative. Inclut la fonction de synchronisation qui poste simplement la fiche dans le forum discord dédié (ID: `1462941781761986732`).
3.  **Hauts Faits (Renown) :** Page de soumission où le joueur rédige ses accomplissements. Ces textes sont envoyés au MJ pour validation. Architecture similaire au **système de puissance de sang des vampires**.
4.  **Dons (Gifts) :** Page de consultation dont le contenu est initialement masqué/vide. Le MJ Loup-Garou (Role ID: `1462941982161764556`) y débloque manuellement les savoirs.

### What Makes This Special

*   **Architecture "Double-Face" :** Une seule codebase, deux univers. L'UX s'adapte sans friction.
*   **Réutilisation Intelligente :** Capitalisation sur le code "Vampire" pour déploiement rapide (DRY).
*   **Sync Discord Narrative :** La fiche de perso vit à la fois sur le site (édition) et sur Discord (présentation sociale).

## 2. Project Classification

**Technical Type:** `web_app` (Module Extension)
**Domain:** `general` (RPG Tooling)
**Complexity:** `medium` (Shared Components, Role Routing)
**Project Context:** Brownfield (Ajout du module Werewolf au site Vampire existant).

## 3. Success Criteria

### User Success
*   **Adoption Sociale :** Les fiches sont postées sans erreur sur le forum Discord dédié (`1462941781761986732`).
*   **Encadrement Narratif :** Le système structure l'écriture (Hauts Faits, Fiche) sans imposer de mécaniques (dés, stats) qui briseraient l'immersion littéraire.

### Technical Success
*   **Routing Robuste :** La détection du rôle `1453870972376584192` est immédiate et fiable.
*   **API Discord :** Le bot gère correctement les posts forums (création de thread par fiche).

## 4. Product Scope

### MVP - Le "Pack de Meute"
*   **Routing :** Bascule via Role `1453870972376584192`.
*   **Création :** Formulaire Unique (Race/Auspice/Tribu).
*   **Fiche :** Édition + Post dans Forum `1462941781761986732`.
*   **Hauts Faits :** Soumission & Validation MJ (modelé sur Blood Potency).
*   **Dons :** Catalogue vide, remplissable par MJ (`1462941982161764556`).

## 5. User Journeys

### Journey 1: Lucas, l'Écrivain (L'Incarnation)
*Scenario: Lucas est un roliste textuel qui rejoint le Discord. Il a le rôle "Loup-Garou".*

1.  **Connexion :** Lucas se connecte. Le site détecte son rôle `1453870972376584192`.
2.  **Ambiance :** Il ne voit aucune statistique. L'interface est épurée, faite pour l'écriture.
3.  **Création :** Il définit son archétype narratif (Race, Auspice, Tribu) qui orientera son style de jeu.
4.  **Rédaction :** Il arrive sur sa fiche. Il prend le temps d'écrire son histoire, ses motivations. Pas de points à répartir, juste des mots à choisir.
5.  **Publication :** Il synchronise. Sa fiche apparaît sur Discord comme une présentation de personnage de roman.

### Journey 2: Sarah, la Lectrice (MJ) (Validation de l'Histoire)
*Scenario: Lucas a écrit un chapitre marquant sur le forum (Haut Fait).*

1.  **Soumission :** Lucas signale sur le site qu'il a accompli un acte important dans son récit ("J'ai purifié le parc").
2.  **Lecture :** Sarah (MJ) reçoit la notif. Elle lit le récit associé (ou le résumé).
3.  **Validation :** Elle valide l'avancement narratif. Le rang de Lucas change, symbolisant son évolution dans la hiérarchie sociale de la meute.
4.  **Inspiration :** Elle débloque un "Don" sur la fiche de Lucas : ce n'est pas un pouvoir chiffré, mais un nouveau trait narratif ou un secret mystique qu'il peut désormais exploiter dans ses textes.

### Journey 3: Marc, le Vampire Curieux (Access Denied)
*Scenario: Marc est un joueur Vampire (Role ID Vampire, PAS Loup-Garou).*

1.  **Tentative :** Marc essaie d'accéder à l'URL directe `/werewolf/sheet` qu'il a vue sur un stream.
2.  **Blocage :** Le système détecte l'absence du rôle `1453870972376584192`.
3.  **Redirection :** Marc est renvoyé immédiatement sur sa fiche Vampire standard, ou sur une page 403 "Vous n'entendez pas l'appel de Gaïa". Le cloisonnement est total.

### Journey Requirements Summary
*   **Role-Based Access Control (RBAC) :** Middleware de routing strict vérifiant les IDs Discord.
*   **Discord Sync (Bidirectionnel) :** Le site doit pouvoir *lire* les rôles (Auth) et *écrire* les rôles/posts (Bot).
*   **Admin Dashboard :** Interface spécifique pour le MJ pour voir les demandes en attente et éditer les fiches joueurs (Dons).

## 6. Innovation & Novel Patterns

### Detected Innovation Areas
*   **System-Less Digital Support :** Ce projet offre un cadre rigide pour l'organisation (Fiches, Rangs) mais invisible pour la création, sans friction mécanique (ni dés, ni stats).
*   **Diegetic UI as Inspiration :** L'interface agit comme un "Mood Board" interactif. Le design (Couleurs, Typographie, Indicateurs de Rage) inspire le ton de l'écriture.
*   **The "Writer's Desk" Metaphor :** La fiche n'est pas un tableau de bord, c'est une table de travail d'écrivain qui se synchronise avec le canal de publication (Discord).

### Validation Approach
*   **Feedback d'Immersion :** La métrique clé est "est-ce que l'interface m'aide à écrire mon personnage ?".
*   **Fluidité de Publication :** Vérifier que le passage de "J'écris sur le site" à "C'est visible sur Discord" est sans friction.

### Risk Mitigation
*   **Le Syndrome de la Page Blanche :** Sans stats pour guider, le joueur peut être perdu.
    *   *Solution :* Les "Dons" et "Hauts Faits" servent de "Prompts" d'écriture. Le MJ débloque des éléments qui donnent des idées d'intrigues.

## 7. Web App Specific Requirements

### Project-Type Overview
Une application React (Vite) modulaire, responsive, où l'interface utilisateur s'adapte conditionnellement au rôle de l'utilisateur connecté.

### Technical Architecture Considerations
*   **Mobile-Friendly but Desktop-First :** L'interface d'écriture doit être confortable sur mobile (responsive), mais l'optimisation prioritaire reste le bureau pour le confort de rédaction longue.
*   **Visibility & Auth :** Les contenus (Fiches, Dons) sont strictement privés (Gated). Aucune indexation SEO. Visibilité publique gérée uniquement via le miroir Discord.
*   **Data Freshness :** Rafraîchissement intelligent (Polling/SWR) suffisant. Pas de WebSockets complexes. Si le MJ valide un Haut Fait, le joueur le verra à son prochain rafraîchissement ou navigation.

### Implementation Considerations
*   **Route Guards :** Implémentation de HOC (Higher Order Components) `RequireWerewolfRole` pour protéger les routes.
*   **Component Forks :** Création de versions "Werewolf" des composants de layout standard (Header, Sidebar) pour changer l'ambiance visuelle (CSS Variables / Themes).

## 8. Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP. L'objectif est de délivrer l'expérience d'écriture ("Writer's Desk") complète et sans friction dès le jour 1, en se reposant sur Discord pour la dimension sociale.
**Resource Requirements:** 1 Dev (React/Node) pour adapter le moteur Vampire.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
*   Lucas (Création & Écriture)
*   Sarah (Validation & Récompense)

**Must-Have Capabilities:**
*   Detection Rôle Discord (Switch Interface)
*   Formulaire Création (Race/Auspice/Tribu/Fléau)
*   Fiche Personnage "Narrative" (Édition Texte + Rangs)
*   Sync Discord (Publication Thread Forum)
*   Hauts Faits (Soumission -> Validation MJ)
*   Dons (Affichage liste débloquée par MJ)

### Post-MVP Features

**Phase 2 (Pack & Totem):**
*   **Fiche de Meute (Totem) :** Une fiche commune pour le groupe, gérée comme un personnage partagé (Nom, Lore, Hauts Faits de Meute).
*   **Rituel de Création de Meute :** Workflow pour lier plusieurs joueurs à un même Totem.

**Phase 3 (Expansion):**
*   *Aucune mécanique de jeu prévue.* L'expansion se concentrera sur des outils d'écriture supplémentaires (e.g. Journal de bord, Chronologie).

### Risk Mitigation Strategy

**Technical Risks:** La gestion des permissions Discord (Bot) peut être capricieuse.
**Mitigation:** Prévoir un mode "Dégradé" où la fiche est sauvée en BDD même si Discord ne répond pas, avec une file d'attente de resynchronisation.

## 9. Functional Requirements

### Access & Identity (Routing)
*   **FR1 :** L'Utilisateur ayant le rôle Discord `Werewolf` accède automatiquement à l'interface Garou à la connexion.
*   **FR2 :** L'Utilisateur PERDANT le rôle `Werewolf` perd immédiatement l'accès au site (Déconnexion ou Redirection).
*   **FR3 :** L'Utilisateur définit ses attributs immuables (Race, Auspice, Tribu) UNIQUEMENT lors de l'Onboarding initial. Ces données ne sont pas modifiables sur la fiche.

### Character Sheet (The Writer's Desk)
*   **FR4 :** L'Utilisateur peut éditer librement le contenu narratif de sa fiche (Histoire, Description, Nom) à tout moment.
*   **FR5 :** Le Système publie automatiquement la première version de la fiche dans le Forum Discord dédié (`1462941781761986732`).
*   **FR6 (Live Sync) :** Le Système **met à jour le contenu du post Discord original** à chaque sauvegarde de la fiche sur le site.
*   **FR7 (Audit Log) :** Le Système poste un rapport de changement (Diff/Log) dans le Canal de Logs dédié (`1457856977660022844`) pour chaque modification validée.

### Progression & Gifts
*   **FR8 :** L'Utilisateur peut soumettre une demande de Renommée (Texte standard).
*   **FR9 :** Le MJ peut valider une demande de Renommée, ce qui met à jour le Rang de l'utilisateur.
*   **FR10 :** Le MJ peut débloquer des Dons spécifiques pour un utilisateur.
*   **FR11 :** L'Utilisateur peut consulter la liste de ses Dons débloqués (Lecture Seule).

### Visibility
*   **FR12 :** L'Utilisateur ne peut voir QUE sa propre fiche sur le site (Pas d'accès aux brouillons des autres).

## 10. Non-Functional Requirements

### Performance
*   **Response Time :** Le basculement de contexte (Switch Rôle Vampire <-> Garou) doit s'effectuer en moins de **2 secondes** pour préserver l'immersion.
*   **Optimisation Assets :** Les fonds d'écran et ambiances sonores doivent être pré-chargés ou optimisés pour ne pas ralentir le chargement de la fiche.

### Reliability
*   **Mode Dégradé (Offline Support) :** En cas de panne de l'API Discord, l'accès au site reste possible en **Lecture Seule** (Consultation de fiche) pour l'utilisateur déjà connecté.
*   **Data Integrity :** Les données "Vérité Terrain" sont stockées en base de données locale, Discord n'est qu'un miroir d'affichage. On ne perd jamais une fiche si Discord est down.

### Security
*   **Role Sealing :** Le middleware de vérification des rôles doit être exécuté côté serveur (Backend) à chaque requête API sensible, pas seulement côté Client.
