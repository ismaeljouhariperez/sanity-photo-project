# Architecture du Projet

## Structure Générale

```
src/app/
├── components/
│   ├── ProjectsList/     # Liste des projets par catégorie
│   ├── ProjectDetail/    # Affichage détaillé d'un projet avec lightbox
│   ├── ui/               # Composants UI réutilisables
│   │   └── DelayedLoader/  # Loader avec délai pour meilleure UX
│   └── transitions/      # Composants de transition entre pages
│       └── PageTransition/  # Animation de transition entre pages
├── projects/
│   ├── page.tsx          # Page d'accueil des projets
│   └── [category]/       # Route dynamique par catégorie
│       ├── page.tsx      # Page serveur de catégorie (métadonnées)
│       ├── client-page.tsx # Composant client pour la catégorie
│       └── [slug]/       # Route dynamique pour un projet spécifique
│           └── page.tsx  # Page de détail (serveur + client)
└── hooks/
    ├── useServices.ts    # Hook d'accès aux services (Sanity, etc.)
    └── useTransitionNavigation.ts  # Hook pour la navigation avec transition
```

## Flux de données

1. L'utilisateur accède à `/projects/[category]`
2. `page.tsx` génère les métadonnées et rend `client-page.tsx`
3. `client-page.tsx` charge le composant `ProjectsList`
4. `ProjectsList` récupère les projets via `useServices().sanity`
5. L'utilisateur clique sur un projet, la navigation se fait via `useTransitionNavigation`
6. L'utilisateur est redirigé vers `/projects/[category]/[slug]`
7. `ProjectDetail` affiche les détails du projet avec lightbox

## Principes d'Architecture

### 1. Routage Dynamique

Utilisation des routes dynamiques Next.js pour gérer les catégories et projets:

- `/projects/[category]` - Liste des projets d'une catégorie
- `/projects/[category]/[slug]` - Détail d'un projet spécifique

### 2. Composants Réutilisables

- Chaque composant est conçu pour être réutilisable
- `ProjectsList` et `ProjectDetail` sont génériques et fonctionnent pour toutes les catégories

### 3. Séparation Client/Serveur

- Composants `page.tsx` pour la partie serveur (métadonnées, SEO)
- Composants `client-page.tsx` ou composants avec directive 'use client' pour l'interactivité

### 4. Gestion d'État

- États locaux avec React useState pour les données spécifiques aux composants
- Store global (AnimationStore) pour les états partagés entre composants

### 5. Services et Hooks

- `useServices` pour l'accès aux API externes (Sanity)
- Hooks personnalisés pour encapsuler la logique réutilisable
