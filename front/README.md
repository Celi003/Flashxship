# FlashxShip Frontend

Frontend moderne et responsive pour la plateforme e-commerce FlashxShip, spécialisée dans la vente et location d'équipements professionnels en Indonésie.

## 🚀 Fonctionnalités

- **Design moderne et responsive** : Interface utilisateur adaptée à tous les appareils
- **Catalogue de produits** : Navigation et filtrage des équipements
- **Système de location** : Location d'équipements avec gestion des durées
- **Panier intelligent** : Gestion des articles avec quantités et durées
- **Authentification complète** : Inscription, connexion et gestion des comptes
- **Paiement sécurisé** : Intégration Stripe pour les transactions
- **Animations fluides** : Transitions et animations avec Framer Motion
- **Optimisé pour l'Indonésie** : Interface adaptée au marché local

## 🛠️ Technologies utilisées

- **React 18** avec TypeScript
- **Material-UI (MUI)** pour l'interface utilisateur
- **React Router** pour la navigation
- **React Query** pour la gestion des données
- **Axios** pour les requêtes API
- **Framer Motion** pour les animations
- **React Hot Toast** pour les notifications
- **Stripe** pour les paiements

## 📦 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd front
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   Créer un fichier `.env` à la racine du projet :
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

L'application sera accessible à l'adresse `http://localhost:8000`

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   └── Layout/         # Composants de mise en page
├── contexts/           # Contextes React (Auth, Cart)
├── pages/              # Pages de l'application
├── services/           # Services API
├── types/              # Types TypeScript
├── App.tsx            # Composant principal
└── index.tsx          # Point d'entrée
```

## 🎨 Design System

### Couleurs principales
- **Primary** : #1976d2 (Bleu professionnel)
- **Secondary** : #dc004e (Rouge accent)
- **Background** : #f5f5f5 (Gris clair)

### Typographie
- **Police principale** : Roboto
- **Hiérarchie** : H1-H6 avec poids de police adaptés

### Composants
- **Boutons** : Coins arrondis, pas de transformation de texte
- **Cartes** : Ombres subtiles, coins arrondis
- **Animations** : Transitions fluides de 0.2s

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL de l'API backend | `http://localhost:8000/api` |
| `REACT_APP_STRIPE_PUBLIC_KEY` | Clé publique Stripe | - |

### Proxy de développement

Le projet est configuré avec un proxy vers `http://localhost:8000` pour éviter les problèmes de CORS en développement.

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints Material-UI :
- **xs** : < 600px (Mobile)
- **sm** : 600px - 960px (Tablet)
- **md** : 960px - 1280px (Desktop)
- **lg** : 1280px - 1920px (Large Desktop)
- **xl** : > 1920px (Extra Large)

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement de production
Assurez-vous de configurer les variables d'environnement appropriées pour la production.

## 🔗 Intégration avec le backend

Le frontend communique avec le backend Django via l'API REST. Assurez-vous que le backend est en cours d'exécution sur `http://localhost:8000` avant de démarrer le frontend.

## 📄 Licence

Ce projet fait partie de la plateforme FlashxShip et est destiné à un usage commercial en Indonésie.

## 👥 Équipe

Développé pour FlashxShip - Votre partenaire de confiance pour l'équipement professionnel en Indonésie.

---

**Note** : Ce frontend est optimisé pour le marché indonésien avec une interface en français et des fonctionnalités adaptées aux besoins locaux.
