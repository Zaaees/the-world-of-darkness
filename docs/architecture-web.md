# Architecture Frontend - Modular Splat System

## Vue d'ensemble (Overview)

L'architecture du frontend Web (`/web`) doit refléter la structure **Core/Modules** du Backend pour supporter la multiplicité des "Splats" (Vampire, Loup-Garou, Mage, etc.) de manière évolutive.

Nous utilisons **React** avec **React Router** pour gérer la navigation dynamique entre le Core (Accueil, Login, Dashboard GM global) et les Modules (Fiches Vampire, Gestion de Clan, etc.).

## 1. Principes Directeurs

1.  **Séparation Stricte Core/Modules** : Le dossier `src/modules/` contient des sous-dossiers totalement autonomes. Le Core ne doit jamais importer un fichier spécifique d'un module en dur (pas de `import VampireSheet from '../modules/vampire'`).
2.  **Chargement Dynamique (Lazy Loading)** : Les modules sont chargés à la demande via `React.lazy` pour ne pas alourdir le bundle initial.
3.  **Manifeste Frontend** : Chaque module expose un fichier `index.js` ou `manifest.js` standardisé qui exporte ses routes, son nom, et ses icônes pour que le Core puisse construire le menu de navigation dynamiquement.
4.  **UI Kit Partagé** : Les modules utilisent des composants génériques fournis par le Core (`@core/components`) pour assurer une cohérence visuelle (Boutons, Inputs, Modales).

---

## 2. Structure des Dossiers (`src/`)

```text
src/
├── core/                  # Infrastructure technique commune
│   ├── components/        # UI Kit (Button, Card, Modal...)
│   ├── contexts/          # États globaux (Auth, Theme, Toast)
│   ├── hooks/             # Hooks partagés (useFetch, useSocket)
│   ├── layout/            # Layouts globaux (MainLayout, Sidebar)
│   ├── router/            # Configuration de React Router
│   └── services/          # API Client, WebSocket Bridge
│
├── modules/               # Les "Splats" et fonctionnalités isolées
│   ├── vampire/           # Module ID: "vampire"
│   │   ├── components/    # Composants spécifiques (VampireSheet, DisciplineIcon)
│   │   ├── pages/         # Vues principales (SheetPage, PowersPage)
│   │   ├── routes.jsx     # Définition des sous-routes (/vampire/sheet, etc.)
│   │   └── index.js       # Point d'entrée (Manifeste)
│   │
│   └── werewolf/          # Module ID: "werewolf" (Futur)
│
├── App.jsx                # Point d'entrée React, Shell
└── main.jsx               # Bootstrapper
```

---

## 3. Le Système de Routing (React Router)

L'application utilise une structure de routage imbriquée.

### A. Router Global (`core/router/AppRouter.jsx`)

Le routeur principal définit les routes du Core et un "Catch-all" pour les modules.

```jsx
// Concept
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  
  {/* Layout Principal avec Sidebar */}
  <Route element={<MainLayout />}>
    <Route path="/dashboard" element={<GmDashboard />} />
    
    {/* Injection dynamique des routes de modules */}
    {loadedModules.map(module => (
      <Route key={module.id} path={`${module.path}/*`} element={<module.RootComponent />} />
    ))}
  </Route>
</Routes>
```

### B. Définition d'un Module (`modules/vampire/index.js`)

Chaque module doit exporter une configuration standard :

```javascript
import { lazy } from 'react';

// Lazy loading du composant racine du module qui contient ses propres <Routes>
const VampireRoot = lazy(() => import('./routes'));

export const VampireModule = {
  id: 'vampire',
  name: 'Vampire: La Mascarade',
  path: '/vampire',
  icon: '🩸',
  // Point d'entrée pour le router global
  RootComponent: VampireRoot,
  // Items de menu à injecter dans la Sidebar
  navItems: [
    { label: 'Fiche', to: '/vampire/sheet' },
    { label: 'Pouvoirs', to: '/vampire/disciplines' }
  ]
};
```

### C. Routes du Module (`modules/vampire/routes.jsx`)

Le module gère ses propres sous-routes.

```jsx
import { Routes, Route } from 'react-router-dom';
import SheetPage from './pages/SheetPage';
import DisciplinesPage from './pages/DisciplinesPage';

export default function VampireRoutes() {
  return (
    <Routes>
      <Route index element={<SheetPage />} /> {/* /vampire/ */}
      <Route path="sheet" element={<SheetPage />} /> {/* /vampire/sheet */}
      <Route path="disciplines" element={<DisciplinesPage />} /> {/* /vampire/disciplines */}
    </Routes>
  );
}
```

---

## 4. Intégration avec l'API Bot

Le frontend ne stocke pas de logique métier complexe ("Règle du lancé de dés"). Il délègue au Backend via l'API.

- **Flux** : `Modules UI` -> `Core Service (API)` -> `Bot Module`
- **Exemple** :
    1. L'utilisateur clique sur "Augmenter Soif" dans `VampireSheet`.
    2. Frontend: `POST /api/modules/vampire/actions/thirst { amount: 1 }`
    3. Backend (Core): Route vers `vampire` module.
    4. Backend (Vampire): Traite la logique et renvoie le nouvel état.
    5. Frontend: Met à jour le contexte React.

## 5. Stratégie de Migration

Pour passer de l'architecture "Monolithique" actuelle à celle-ci :

1. **Installer React Router** : `npm install react-router-dom`
2. **Créer le Core Folder** : Déplacer les composants génériques existants.
3. **Créer le Module Vampire** : Déplacer `VampireSheet` et ses tabs dans `src/modules/vampire`.
4. **Setup du Router** : Mettre en place `BrowserRouter` dans `App.jsx`.
