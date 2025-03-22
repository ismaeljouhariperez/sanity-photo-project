# Guide de Contribution

## Installation du Projet

1. Clonez le repository

```bash
git clone [url-du-repository]
cd [nom-du-projet]
```

2. Installez les dépendances

```bash
npm install
```

3. Démarrez le serveur de développement

```bash
npm run dev
```

## Structure des Composants

### Ajout d'un Nouveau Composant

1. Créez un nouveau dossier dans `src/app/components/`
2. Suivez cette structure:
   ```
   MonComposant/
   ├── index.tsx      # Point d'entrée principal
   ├── styles.module.css  # Styles spécifiques (si nécessaire)
   └── components/    # Sous-composants (si nécessaire)
   ```

### Conventions de Nommage

- Utilisez PascalCase pour les noms de composants
- Utilisez camelCase pour les noms de fonctions et variables
- Utilisez UPPER_SNAKE_CASE pour les constantes

## Ajout d'une Nouvelle Catégorie de Projets

Pour ajouter une nouvelle catégorie (exemple: "portraits"):

1. Ajoutez la nouvelle valeur dans le type:

   ```tsx
   type CategoryType = 'black-and-white' | 'early-color' | 'portraits'
   ```

2. Mettez à jour les fonctions qui utilisent des correspondances de catégorie:

   ```tsx
   const categoryTitle =
     category === 'black-and-white'
       ? 'Noir et Blanc'
       : category === 'early-color'
       ? 'Couleur'
       : category === 'portraits'
       ? 'Portraits'
       : 'Autre'
   ```

3. Ajoutez la nouvelle catégorie dans votre base de données Sanity.

## Flux de Travail Git

1. Créez une branche pour votre fonctionnalité

   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   ```

2. Effectuez des commits atomiques avec des messages clairs

   ```bash
   git commit -m "feat: ajoute la fonctionnalité X"
   ```

3. Faites une Pull Request vers la branche principale

## Bonnes Pratiques

### Performance

- Utilisez l'optimisation d'images Next.js (`<Image>`)
- Chargez les données de manière optimisée
- Utilisez la mémorisation quand c'est possible

### Accessibilité

- Assurez-vous que les composants sont accessibles (WCAG)
- Utilisez des attributs appropriés (alt, aria-\*)
- Testez avec un lecteur d'écran

### Tests

- Écrivez des tests unitaires pour les composants principaux
- Écrivez des tests d'intégration pour les flux critiques
