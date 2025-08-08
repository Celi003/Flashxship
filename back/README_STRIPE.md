# Configuration Stripe Backend

## Configuration requise

### 1. Clés API Stripe

Dans `back/back/settings.py`, configurez vos clés Stripe :

```python
# Stripe Configuration
STRIPE_SECRET_KEY = "sk_test_votre_cle_secrete"
STRIPE_PUBLIC_KEY = "pk_test_votre_cle_publique"
STRIPE_WEBHOOK_SECRET = "whsec_votre_webhook_secret"
```

### 2. Obtention des clés

1. **Clés API** :
   - Allez sur [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copiez la "Secret key" (commence par `sk_test_`)
   - Copiez la "Publishable key" (commence par `pk_test_`)

2. **Webhook Secret** :
   - Allez sur [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - Cliquez sur "Add endpoint"
   - URL : `https://votre-domaine.com/api/webhook/stripe/`
   - Événements : `checkout.session.completed`, `payment_intent.payment_failed`
   - Copiez le "Signing secret" (commence par `whsec_`)

### 3. Test de l'API

Utilisez le script de test :

```bash
cd back
python ../test_checkout.py
```

### 4. Cartes de test

- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **Date** : N'importe quelle date future
- **CVC** : N'importe quels 3 chiffres

## Fonctionnalités implémentées

### ✅ API Checkout
- Création de session Stripe
- Gestion des produits et équipements
- Calcul automatique des prix
- Métadonnées pour tracer les commandes

### ✅ Webhook Stripe
- Gestion des paiements réussis
- Mise à jour du statut des commandes
- Gestion des échecs de paiement

### ✅ Sécurité
- Authentification requise pour checkout
- Validation des signatures webhook
- Gestion des erreurs

## URLs API

- `POST /api/checkout/` - Créer une session de paiement
- `GET /api/orders/session/{session_id}/` - Récupérer les détails d'une commande
- `POST /api/webhook/stripe/` - Webhook Stripe

## Exemple de requête checkout

```json
{
  "items": [
    {
      "id": 1,
      "type": "product",
      "quantity": 2,
      "days": 1
    }
  ],
  "customer_info": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "0123456789",
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "success_url": "http://localhost:3000/success?success=true&session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "http://localhost:3000/cart"
}
```

## Déploiement

Pour la production :

1. Utilisez les clés live Stripe (`sk_live_`, `pk_live_`)
2. Configurez un webhook avec votre domaine de production
3. Activez HTTPS pour les webhooks
4. Testez avec de vraies cartes en mode test 