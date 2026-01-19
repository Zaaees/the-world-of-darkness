---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: [
  "f:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/_bmad-output/analysis/brainstorming-session-2026-01-13.md"
]
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 1
  projectDocs: 0
workflowType: 'prd'
lastStep: 4
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
