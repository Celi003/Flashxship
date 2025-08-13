# Configuration Stripe pour FLASHXSHIP

## Variables d'environnement requises

Créez un fichier `.env` dans le dossier `back/` avec les variables suivantes :

```bash
# Configuration Stripe
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Configuration Frontend
FRONTEND_URL=http://localhost:3000

# Configuration Email
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

## Configuration du Webhook Stripe

### 1. **Webhook Secret** :
- Allez sur [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
- Créez un nouveau webhook ou modifiez l'existant
- URL : `https://votre-domaine.com/stripe-webhook/`
- Événements à écouter : `checkout.session.completed`

### 2. **Récupération du Secret** :
- Après avoir créé le webhook, cliquez dessus
- Dans la section "Signing secret", cliquez sur "Reveal"
- Copiez le secret commençant par `whsec_`
- Mettez-le dans votre fichier `.env` comme `STRIPE_WEBHOOK_SECRET`

### 3. **Test du Webhook** :
- Utilisez l'outil de test Stripe pour envoyer un événement `checkout.session.completed`
- Vérifiez que votre endpoint répond correctement

## Problèmes courants et solutions

### Le statut de la commande ne se met pas à jour après le paiement

**Cause probable** : Le webhook Stripe n'est pas configuré correctement ou le secret est invalide.

**Solutions** :
1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct dans votre `.env`
2. Assurez-vous que l'URL du webhook est accessible depuis Internet
3. Vérifiez les logs du serveur pour les erreurs de validation de signature
4. Testez le webhook avec l'outil de test Stripe

### Erreur de validation de signature

**Cause** : Le secret du webhook ne correspond pas à celui configuré dans Stripe.

**Solution** : Mettez à jour `STRIPE_WEBHOOK_SECRET` avec le bon secret depuis le dashboard Stripe.

## Déploiement en production

1. Configurez un webhook avec votre domaine de production
2. Activez HTTPS pour les webhooks
3. Mettez à jour `FRONTEND_URL` avec votre URL de production
4. Utilisez des clés Stripe de production (pas de test)

## Test local

Pour tester en local avec Stripe CLI :

```bash
# Installer Stripe CLI
stripe listen --forward-to localhost:8000/stripe-webhook/

# Copier le webhook secret affiché dans votre .env
``` 