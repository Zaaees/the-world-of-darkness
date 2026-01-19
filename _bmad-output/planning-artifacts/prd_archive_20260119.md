---
stepsCompleted: [1, 2]
inputDocuments: [
  "c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/research/domain-Rituels_V20_Thaumaturgie_et_Necromancie-research-2026-01-07.md",
  "c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/research/technical-integration-rituels-v20-narratif-research-2026-01-08.md",
  "C:/Users/freed/.gemini/antigravity/brain/524d1372-e4fd-4b31-b04c-939286cfa3e3/implementation_plan.md"
]
documentCounts:
  briefs: 0
  research: 2
  brainstorming: 0
  projectDocs: 1
workflowType: 'prd'
lastStep: 2
---

# Product Requirements Document - the-world-of-darkness

**Author:** Zaès
**Date:** 2026-01-08

## 1. Executive Summary

Ce projet vise à réaliser une intégration complète et immersive des **Rituels de Thaumaturgie et Nécromancie (V20)** dans l'application web existante. L'objectif est de remplacer la base de données actuelle par un contenu exhaustif, restructuré sous forme d'un **"Grimoire Narratif"**.

L'essence du projet réside dans la **"Pureté Narrative"** : offrir aux joueurs une expérience de lecture diégétique (in-universe), débarrassée de tout vocabulaire de règles visible (pas de "jets de dés", "difficulté", etc.), tout en conservant strictement les mécaniques de filtrage (Clan, Puissance du Sang) en arrière-plan.

### What Makes This Special

*   **Immersion Totale :** Transformation d'un simple catalogue de règles en un véritable artefact de jeu de rôle. Les contraintes mécaniques (coût en sang, dangerosité) sont traduites en avertissements narratifs.
*   **Intégration Transparente :** Respect complet de l'architecture technique existante (React, Modules) et des règles d'accès (droit de voir le rituel), sans perturber l'expérience utilisateur actuelle.
*   **Contenu Riche :** Utilisation d'un processus de rédaction dédié (IA + Révision) pour "polir" la recherche brute et garantir un ton littéraire élevé ("High Grimoire").

## 2. Project Classification

| Category | Type | Description |
| :--- | :--- | :--- |
| **Technical Type** | `web_app` | Extension d'une application React existante (Brownfield). Mise à jour de données et refonte de composants d'affichage. |
| **Domain** | `general` | Outil de Jeu de Rôle / Divertissement. |
| **Complexity** | `medium` | Défi principal : Volume de contenu à rédiger/traduire et gestion fine de l'UX pour masquer la complexité mécanique sous une couche narrative. |

### Project Context
Le projet s'inscrit dans une application existante "The World of Darkness". Il ne s'agit pas d'une refonte complète du site, mais d'une **mise à jour ciblée et profonde** du module "Rituels". Une phase spécifique de **Production de Contenu** est nécessaire avant l'intégration technique.

## 3. Success Criteria

| Metric | Target | Description |
| :--- | :--- | :--- |
| **Immersion (Qualitatif)** | "Waoo" Feedback | Les joueurs doivent ressentir l'ambiance "Grimoire". Retours positifs explicites attendus sur le style narratif des textes. |
| **Périmètre Contenu** | 100% au Lancement | L'intégralité des rituels V20 (Thaumaturgie & Nécromancie) doit être disponible et traduite dès la mise en production. |
| **Mobile Experience** | Critique | La lecture des textes longs doit être parfaite sur mobile. L'UI doit gérer élégamment la navigation "Liste -> Détail" sur petit écran. |
| **Navigation UX** | Fluide | L'interface doit gérer efficacement la progression du joueur (qui commence avec 0 rituels). L'expérience "Grimoire qui se remplit" est prioritaire sur la "Recherche dans une base de données complète". |

## 4. User Personas & User Flows

### Persona 1: L'Initié (Joueur)
*   **Profil :** Joueur sur mobile ou desktop. Commence avec 0 connaissances.
*   **Objectif :** Consulter son grimoire personnel pour jouer son personnage.
*   **Flux Principal :**
    1.  **Accès :** Ouvre l'onglet "Rituels".
    2.  **Visualisation :** Ne voit **QUE** les rituels qu'il a acquis (Liste vide au départ). Les rituels inconnus sont totalement invisibles (pas de "grisé", pas de "spoiler").
    3.  **Consultation :** Clique sur un rituel acquis pour lire la description narrative ("Grimoire").
    4.  **Usage :** Utilise les informations diégétiques ("Il faut sacrifier une colombe...") pour son Roleplay.

### Persona 2: Le Conteur (Game Master)
*   **Profil :** Administrateur sur Desktop.
*   **Objectif :** Gérer l'attribution des rituels et vérifier les pré-requis.
*   **Flux Principal :**
    1.  **Accès :** Ouvre la "Bibliothèque Interdite" (Vue complète).
    2.  **Recherche :** Voit la liste **TOTALE** (100+) de tous les rituels disponibles dans le système.
    3.  **Filtrage :** Utilise des filtres (Clan, Discipline, Niveau) pour trouver un rituel spécifique.
    4.  **Attribution :** Sélectionne un joueur cible et lui "débloque" le rituel (Ajoute l'ID à la liste du joueur).

## 5. Functional Requirements

### 5.1 Gestion des Données (Data Management)
*   **Stockage :** Fichiers Statics JSON/JS (`rituals_v20.js`). Pas de base de données SQL pour le contenu textuel.
*   **Structure :** Liste d'objets avec `id`, `name`, `level`, `discipline`, `clan_requirement`, `blood_requirement`, `description_md` (Markdown).
*   **Rich Text :** Le champ description doit supporter le format **Markdown** pour permettre gras, italique, et sauts de ligne narratifs.

### 5.2 Moteur de Recherche (Search Engine)
*   **Technologie :** Recherche floue (Fuzzy Search) côté client (ex: `fuse.js`).
*   **Critères :** Recherche sur Titre (FR/EN) et Mots-clés dans la description.
*   **Tolérance :** Doit trouver "Thaumaturgy" même si l'utilisateur tape "Tomaturgie".

### 5.3 Logique d'Attribution (Assignment Logic)
*   **Mode :** "Soft Warning" (Avertissement Non-Bloquant).
*   **Comportement :** Le GM peut techniquement attribuer n'importe quel rituel à n'importe quel joueur.
*   **Alerte :** Si le joueur cible ne remplit pas les conditions (Mauvais Clan, Puissance de Sang trop faible), une modale de confirmation apparaît : *"Attention : [NomJoueur] n'a pas les pré-requis (Clan/Sang). Confirmer l'attribution ?"*.

### 5.4 Affichage Conditionnel
*   **Liste Joueur :** Filtre strict. `if (player.rituals.includes(ritual.id))` -> Affiche. Sinon -> Rien.
*   **Détail Rituel :** Affichage optimisé pour la lecture ("Mode Liseuse/Grimoire"). Typographie adaptée.

## 6. Non-Functional Requirements

### 6.1 Security & Anti-Cheat
*   **Modèle :** "Fair-Play".
*   **Risque Accepté :** Les données des rituels sont chargées côté client (JSON). Un utilisateur averti (F12) peut techniquement lire les données brutes.
*   **Validation :** "Good Enough" pour un outil communautaire de JDR. Pas de sécurisation backend complexe requise pour ce contenu.

### 6.2 Performance
*   **Load Time :** Le fichier `rituals_v20.js` (~200-500KB) doit se charger sans ralentir le reste du site.
*   **Virtualisation :** Usage impératif de `react-window` (ou équivalent) pour la liste si > 50 éléments sur mobile, afin de garantir un scroll fluide à 60fps.

### 6.3 Compatibilité
*   **Mobile First :** Le design doit être pensé pour un écran de smartphone (Portrait) en priorité pour la lecture.
*   **Navigateurs :** Chrome, Firefox, Safari (iOS), Edge.

## 7. Approuvé
Ce document sert de référence pour la génération des User Stories et le développement.
*   **Statut :** VALIDÉ
*   **Prochaine Étape :** Production de Contenu (Narrative Writing) & Architecture Technique.
