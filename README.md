# BuildFlow — Suivi de chantiers & Kanban BTP

## 1. Présentation du projet

BuildFlow est une application web de gestion de projets BTP permettant de suivre l'avancement de plusieurs chantiers à travers une interface Kanban claire et structurée.

L'objectif est de centraliser les tâches liées aux chantiers afin de visualiser rapidement :

- les tâches à faire ;
- les tâches en cours ;
- les tâches bloquées ;
- les tâches terminées ;
- les responsables ;
- les échéances ;
- les priorités ;
- l'avancement global des projets.

Cette première version a été conçue comme une base fonctionnelle, propre et facilement améliorable pour la suite du TP.

---

## 2. Contexte métier

Dans une entreprise du BTP, le suivi des tâches peut rapidement devenir difficile lorsque plusieurs chantiers avancent en parallèle. Certaines tâches dépendent de validations, de livraisons, de responsables différents ou de contraintes de planning.

BuildFlow répond à ce besoin en proposant un outil simple de pilotage :

- une vue globale des chantiers ;
- un tableau Kanban par chantier ;
- une identification rapide des blocages ;
- une meilleure lisibilité des responsabilités ;
- un suivi des échéances et des priorités.

L'application s'inspire de situations réalistes du BTP : gros œuvre, second œuvre, coordination, sécurité, approvisionnement, contrôle qualité et tâches administratives.

---

## 3. Fonctionnalités réalisées

### Pages principales

- Page d'accueil sous forme de dashboard.
- Page de liste des chantiers.
- Page Kanban par chantier.
- Page détail d'une tâche.
- Page planning.
- Page reporting.
- Page équipe.

### Gestion des chantiers

- Affichage des chantiers sous forme de cartes.
- Informations métier : client, ville, budget, dates, responsable, progression.
- Accès au Kanban d'un chantier depuis sa carte.

### Gestion des tâches

Chaque tâche contient les informations suivantes :

- titre ;
- chantier associé ;
- responsable ;
- échéance ;
- priorité ;
- statut ;
- catégorie ;
- description ;
- checklist ;
- commentaires.

### Tableau Kanban

Le Kanban contient les colonnes suivantes :

- À faire ;
- En cours ;
- Bloqué ;
- Terminé.

Les tâches sont affichées dans la colonne correspondant à leur statut.

### Formulaire

- Formulaire d'ajout de tâche.
- Formulaire de modification de tâche.
- Utilisation de `v-model` pour relier les champs du formulaire aux données Vue.
- Validation minimale des champs obligatoires.

### Filtres et recherche

- Recherche textuelle.
- Filtre par priorité.
- Filtre par statut.
- Filtre par responsable.
- Filtre par chantier ou catégorie selon les vues.

### Interface utilisateur

- Interface responsive.
- Navigation visible.
- Couleurs sobres adaptées au BTP : bleu, gris, orange, blanc, vert et rouge pour les états.
- Icônes SVG et symboles visuels à la place d'emojis pour un rendu plus professionnel.
- Thème clair / sombre.
- Cartes homogènes et lisibles.

### Backend

- Backend Node.js / Express séparé du frontend.
- API JSON.
- Routes de consultation, création, modification et suppression.
- Jeu de données réaliste pour simuler une première base métier.

---

## 4. Technologies utilisées

### Frontend

- Vue 3
- Vite
- Vue Router
- JavaScript
- CSS

### Backend

- Node.js
- Express
- CORS
- Données JSON en mémoire pour cette première version

### Outils

- Git
- GitHub
- Visual Studio Code
- npm

---

## 5. Arborescence du projet

```txt
buildflow/
│
├── backend/
│   ├── server.js
│   ├── data.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/
│       │   └── index.js
│       ├── components/
│       │   ├── Navbar.vue
│       │   ├── ProjectCard.vue
│       │   ├── KanbanColumn.vue
│       │   ├── TaskCard.vue
│       │   └── TaskForm.vue
│       ├── views/
│       │   ├── DashboardView.vue
│       │   ├── ProjectsView.vue
│       │   ├── KanbanView.vue
│       │   ├── TaskDetailView.vue
│       │   ├── PlanningView.vue
│       │   ├── ReportingView.vue
│       │   └── TeamView.vue
│       └── services/
│           └── api.js
│
├── package.json
├── README.md
└── .gitignore
```

---

## 6. Installation et lancement

### Prérequis

- Node.js installé
- npm installé
- Git installé

### Installation

Depuis la racine du projet :

```bash
npm install
npm run install:all
```

### Lancement du projet

```bash
npm run dev
```

Le frontend est généralement accessible à l'adresse :

```txt
http://localhost:5173
```

Le backend est généralement accessible à l'adresse :

```txt
http://localhost:3000
```

Route de test du backend :

```txt
http://localhost:3000/api/health
```

---

## 7. Routes principales de l'application

### Frontend

```txt
/              Dashboard
/projects      Liste des chantiers
/kanban/:id    Tableau Kanban d'un chantier
/tasks/:id     Détail d'une tâche
/planning      Planning
/reporting     Reporting
/team          Équipe
```

### Backend

Exemples de routes API :

```txt
GET    /api/projects       Récupérer les chantiers
GET    /api/tasks          Récupérer les tâches
POST   /api/tasks          Créer une tâche
PATCH  /api/tasks/:id      Modifier une tâche
DELETE /api/tasks/:id      Supprimer une tâche
GET    /api/activities     Récupérer l'activité récente
```

---

## 8. Explication technique rapide

### Vue Router

Vue Router permet de séparer les différentes pages de l'application sans recharger entièrement le site. Chaque URL correspond à une vue spécifique.

### Composants Vue

L'interface est découpée en composants pour améliorer la lisibilité et la réutilisabilité du code. Par exemple :

- `TaskCard.vue` affiche une tâche ;
- `KanbanColumn.vue` affiche une colonne du Kanban ;
- `TaskForm.vue` gère le formulaire d'ajout ou de modification ;
- `ProjectCard.vue` affiche une carte chantier.

### Backend Express

Le backend Express fournit les données au frontend sous forme de JSON. Cette séparation permet de garder une architecture propre :

- le frontend gère l'affichage ;
- le backend gère les données et les routes API.

### Données

Pour cette première version, les données sont stockées dans un jeu de données en mémoire. Ce choix permet d'avoir rapidement une base fonctionnelle, tout en gardant une structure qui pourra être remplacée plus tard par une vraie base de données.

---

## 9. Utilisation de l'IA dans le projet

L'intelligence artificielle a été utilisée comme un assistant de développement, mais pas comme un remplacement du travail de conception.

Elle a servi principalement à :

- proposer une première structure de composants ;
- accélérer la rédaction de certains fichiers répétitifs ;
- améliorer l'organisation visuelle de l'interface ;
- aider à reformuler ou compléter le README ;
- suggérer des idées de fonctionnalités supplémentaires.


---

## 10. Fonctionnalités supplémentaires ajoutées

Par rapport au minimum demandé, plusieurs améliorations ont été ajoutées :

- dashboard avec indicateurs clés ;
- thème sombre ;
- interface plus professionnelle ;
- reporting ;
- planning ;
- page équipe ;
- commentaires sur les tâches ;
- checklist ;
- indicateurs de blocage ;
- indicateurs de retard ;
- suivi de l'avancement global ;
- icônes SVG sobres ;
- meilleure organisation visuelle.

Ces ajouts ne remplacent pas le cœur du TP : ils renforcent l'objectif principal, qui reste le suivi de chantiers par Kanban.

---

## 11. Limites connues

Cette version reste une première base de projet. Certaines limites existent encore :

- les données ne sont pas encore stockées dans une vraie base de données ;
- les données peuvent être réinitialisées au redémarrage du serveur ;
- il n'y a pas encore d'authentification ;
- les rôles utilisateurs ne sont pas encore sécurisés ;
- les commentaires et checklists ne sont pas encore persistés dans une vraie base ;
- il n'y a pas encore de tests automatisés ;
- il n'y a pas encore d'upload de documents chantier.

---

## 12. Reprise du projet (Partie 2)

Dans le cadre de la seconde partie du projet, plusieurs améliorations ont été apportées afin de rendre l'application plus interactive, robuste et ergonomique.

### Débogage et vérifications initiales
- Vérification et consolidation de l'architecture existante.
- Ajout des routes manquantes dans l'API Express (`PUT` et `DELETE` sur `/api/tasks/:id`).
- Adaptation du frontend (service API) pour correspondre rigoureusement aux méthodes du backend.

### Édition et suppression de tâches
- **Édition :** Possibilité de mettre à jour l'intégralité d'une tâche (titre, description, statut, priorité, échéance, etc.) depuis la vue de détail.
- **Suppression :** Ajout d'une fonctionnalité de suppression sécurisée par une alerte de confirmation native, accessible depuis les cartes du Kanban et le tableau de bord.

### Gestion des états (UX)
L'expérience utilisateur a été grandement fluidifiée grâce aux retours visuels :
- **Chargement :** Intégration d'un indicateur visuel animé (*spinner*) pendant le chargement des données.
- **Erreurs :** Affichage de messages clairs en cas d'échec de la communication avec l'API.
- **Notifications (Toasts) :** Apparition de notifications éphémères confirmant le succès des actions utilisateur (création, modification, suppression).
- **États vides :** Amélioration visuelle des colonnes Kanban avec un message explicite et illustré lorsqu'aucune tâche n'est présente.

### Système de notes de chantier
- Enrichissement du modèle de données (backend) avec un nouveau champ `notes` pour les tâches.
- Création d'un encart dédié "Notes de chantier" dans la page de détail d'une tâche.
- Implémentation d'une édition *inline* permettant de lire et de sauvegarder rapidement des remarques spécifiques à une tâche.
- Refonte visuelle globale (CSS natif) pour aérer les cartes, optimiser les contrastes et moderniser l'interface tout en respectant l'identité BTP (bleu profond, orange vif, nuances de gris).

---

## 13. Conclusion

BuildFlow répond au cahier des charges de la première partie du TP : l'application est exécutable, structurée, lisible, documentée et centrée sur un besoin métier réaliste du BTP.

Le projet propose une base solide pour suivre des chantiers avec un Kanban, tout en restant améliorable pour les prochaines étapes.
