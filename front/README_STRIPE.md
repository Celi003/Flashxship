# Configuration Stripe pour le Frontend

## Installation des dépendances

```bash
npm install @stripe/stripe-js
```

## Configuration des variables d'environnement

Créez un fichier `.env` dans le dossier `front/` avec les variables suivantes :

```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000
```

## Obtention de la clé Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Allez dans le Dashboard Stripe
3. Dans la section "Developers" > "API keys"
4. Copiez la "Publishable key" (commence par `pk_test_` pour le mode test)
5. Remplacez `pk_test_your_publishable_key_here` par votre vraie clé

## Test du paiement

Pour tester le paiement en mode développement, utilisez ces cartes de test Stripe :

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **Date d'expiration** : N'importe quelle date future
- **CVC** : N'importe quels 3 chiffres

## Fonctionnalités implémentées

- ✅ Intégration Stripe Checkout
- ✅ Processus de commande en 4 étapes
- ✅ Validation des formulaires
- ✅ Gestion des erreurs
- ✅ Redirection sécurisée vers Stripe
- ✅ Confirmation de paiement
- ✅ Vidage automatique du panier après paiement réussi 