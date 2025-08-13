# Guide de dépannage - Statut de commande non mis à jour

## Problème
Après avoir effectué un paiement avec succès, le statut de la commande affiche toujours "En attente de paiement" au lieu de se mettre à jour.

## Causes possibles et solutions

### 1. Webhook Stripe non configuré ❌

**Symptôme** : Le statut ne change jamais après le paiement.

**Cause** : Le webhook Stripe n'est pas configuré ou le secret est invalide.

**Solution** :
```bash
# Vérifier la configuration
cd back
python configure_stripe.py

# Si le webhook secret n'est pas configuré :
# 1. Allez sur https://dashboard.stripe.com/webhooks
# 2. Créez un webhook vers: https://votre-domaine.com/stripe-webhook/
# 3. Copiez le 'Signing secret' (commence par whsec_)
# 4. Mettez-le dans votre fichier .env ou settings.py
```

### 2. Test en local avec Stripe CLI ✅

**Pour tester en local** :
```bash
# Installer Stripe CLI
# Windows: https://stripe.com/docs/stripe-cli#install
# macOS: brew install stripe/stripe-cli/stripe

# Écouter les webhooks
stripe listen --forward-to localhost:8000/stripe-webhook/

# Copier le webhook secret affiché dans votre .env
```

### 3. Vérifier les logs du serveur 🔍

**Dans le terminal du serveur Django** :
```bash
cd back
python manage.py runserver

# Regardez les logs quand vous effectuez un paiement
# Vous devriez voir :
# "Webhook reçu: whsec_..."
# "Événement Stripe validé: checkout.session.completed"
# "Webhook: Commande X mise à jour - Paiement: PAID, Statut: CONFIRMED"
```

### 4. Test manuel du webhook 🧪

**Tester le webhook** :
```bash
cd back
python test_webhook.py
```

### 5. Vérifier la base de données 💾

**Vérifier le statut de la commande** :
```bash
cd back
python manage.py shell

# Dans le shell Django :
from vente.models import Order
order = Order.objects.get(id=1)  # Remplacez 1 par l'ID de votre commande
print(f"Statut: {order.status}")
print(f"Paiement: {order.payment_status}")
print(f"Session Stripe: {order.stripe_session_id}")
```

## Solutions implémentées

### Backend ✅
- Correction du statut de commande dans le webhook (PAID → CONFIRMED)
- Amélioration des logs de débogage
- Correction de l'URL de succès Stripe
- Gestion des erreurs améliorée

### Frontend ✅
- Rafraîchissement automatique des données
- Notifications informatives pour l'utilisateur
- Bouton de rafraîchissement manuel
- Indicateur de synchronisation
- Gestion des erreurs améliorée

## Vérification finale

Après avoir appliqué toutes les corrections :

1. **Redémarrez le serveur Django**
2. **Effectuez un nouveau paiement de test**
3. **Vérifiez les logs du serveur**
4. **Vérifiez que le statut se met à jour**

## Support

Si le problème persiste :
1. Vérifiez les logs du serveur
2. Testez avec Stripe CLI
3. Vérifiez la configuration du webhook dans le dashboard Stripe
4. Assurez-vous que l'URL du webhook est accessible depuis Internet
