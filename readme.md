# Budget Monitor

Application web MERN pour la gestion de budget personnel et le suivi d'épargne sur 12 mois glissants.

## Objectif

- Suivre ses finances mensuelles (dépenses, revenus, prélèvements, épargne)
- Visualiser l'évolution du solde et de l'épargne
- Planifier les mouvements à venir (prélèvements, versements, carte à débit différé)
- Application sécurisée, mobile first, avec thèmes sombre/clair adaptatifs et multilingue (français/anglais)

## Fonctionnalités principales

- **Authentification sécurisée** (email/mot de passe, JWT, hashage bcrypt)
- **Gestion des prélèvements** (récurrents, ponctuels, coche mensuelle)
- **Gestion des revenus** (fixes, variables, planification de versements)
- **Gestion des dépenses à débit différé** (ex : carte à débit différé)
- **Suivi de l'épargne** (saisie manuelle, graphique d'évolution)
- **Synthèse mensuelle et prévisionnelle** (solde, découvert autorisé, mouvements à venir)
- **Thème sombre/clair** (auto, mobile first)
- **Internationalisation** (tous les textes via fichiers JSON, FR/EN)
- **Navigation mobile first** (barre de navigation en bas de l'écran)
- **Pages interactives** (ajout, modification, suppression de mouvements)

## Stack technique

- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Frontend** : Vite + React (mobile first, thèmes adaptatifs, i18n, axios, react-router)
- **Sécurité** : bcrypt, JWT (httpOnly cookie), helmet, cors, validation/sanitisation des entrées
- **Déploiement** : Docker (images séparées backend/frontend)

## Organisation du projet

```
BudgetMonitor/
│
├── backend/         # API Node.js/Express + MongoDB
│   ├── Dockerfile
│   └── ... (src, config, etc.)
│
├── frontend/        # Application React (Vite, mobile first, i18n)
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/   # Composants réutilisables (DebitList, IncomeList, etc.)
│   │   ├── pages/        # Pages principales (Dashboard, Debits, Incomes, Savings, Settings)
│   │   ├── locales/      # Fichiers de traduction JSON (fr, en)
│   │   ├── contexts/     # Contextes globaux (Auth, etc.)
│   │   └── ...
│   └── ...
│
├── .github/workflows/    # CI GitHub Actions (tests backend)
├── docker-compose.yml    # (optionnel, pour dev ou déploiement groupé)
└── readme.md
```

## Lancer le projet

### 1. Backend

```
cd backend
cp .env.example .env # Adapter les variables si besoin
npm install
npm run dev
```

### 2. Frontend

```
cd frontend
npm install
npm run dev
```

### 3. Docker (production ou dev groupé)

```
# Depuis la racine du projet
docker-compose up --build
```

## Fonctionnalités frontend

- Authentification (connexion, inscription, déconnexion, persistance via cookie sécurisé)
- Navigation mobile first (barre en bas, responsive)
- Pages :
  - Dashboard (synthèse)
  - Prélèvements (liste, ajout, suppression, édition à venir)
  - Revenus (liste, ajout, suppression, édition à venir)
  - Épargne (liste, ajout, suppression, édition à venir)
  - Paramètres (configuration utilisateur)
- Thème sombre/clair auto, multilingue (FR/EN, fichiers JSON)
- Connexion API sécurisée (axios, gestion des erreurs, feedback utilisateur)

## À venir
- Ajout/édition/suppression interactifs sur toutes les entités
- Graphiques de synthèse (solde, épargne, flux)
- Accessibilité et UX avancée
- Documentation API et schémas de données

---

**Auteur :** Arus Joshua
