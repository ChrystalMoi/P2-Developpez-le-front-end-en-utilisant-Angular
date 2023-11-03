# P2-Developpez-le-front-end-en-utilisant-Angular

Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3.

N'oubliez pas d'installer vos node_modules avant de commencer (`npm install`).

## Serveur de développement

Exécutez `ng serve` pour lancer le serveur de développement. Accédez à `http://localhost:4200/`. L'application se rechargera automatiquement si vous modifiez l'un des fichiers source.

## Construction

Exécutez `ng build` pour construire le projet. Les artefacts de construction seront stockés dans le répertoire `dist/`.

## Par où commencer

Comme vous pouvez le voir, une architecture a déjà été définie pour le projet. Il s'agit simplement d'une suggestion, vous pouvez choisir d'utiliser la vôtre. L'architecture prédéfinie comprend (en plus de l'architecture Angular par défaut) les éléments suivants :

- Dossier `components` : contient tous les composants réutilisables.
- Dossier `pages` : contient les composants utilisés pour la navigation.
- Dossier `core` : contient la logique métier (les dossiers `services` et `models`).

Je vous suggère de commencer par comprendre ce code de démarrage. Accordez une attention particulière au fichier `app-routing.module.ts` et au fichier `olympic.service.ts`.

Une fois que vous les maîtrisez, vous devriez continuer en créant les interfaces TypeScript à l'intérieur du dossier `models`. Comme vous pouvez le constater, j'ai déjà créé deux fichiers correspondant aux données incluses dans `olympic.json`. Avec vos interfaces, améliorez le code en remplaçant chaque `any` par l'interface correspondante.

Vous êtes maintenant prêt à mettre en œuvre les fonctionnalités demandées.

Bonne chance !
