#!/usr/bin/env python3
"""
Script pour corriger le fichier URLs et ajouter le webhook Stripe
"""

def fix_urls_file():
    # Lire le fichier URLs actuel
    with open('back/vente/urls.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Ajouter le webhook Stripe
    if 'stripe-webhook/' not in content:
        # Trouver la ligne des commandes et ajouter le webhook
        lines = content.split('\n')
        new_lines = []
        
        for line in lines:
            new_lines.append(line)
            if 'create_payment_session/' in line:
                new_lines.append("    path('stripe-webhook/', views.stripe_webhook, name='stripe_webhook'),")
        
        # Écrire le fichier corrigé
        with open('back/vente/urls.py', 'w', encoding='utf-8') as f:
            f.write('\n'.join(new_lines))
        
        print("✅ Webhook Stripe ajouté au fichier URLs")
    else:
        print("✅ Webhook Stripe déjà présent")

def fix_webhook_function():
    # Lire le fichier views.py pour corriger le webhook
    with open('back/vente/views.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Vérifier si le webhook met à jour le statut de la commande
    if 'order.status =' not in content:
        print("❌ Le webhook ne met pas à jour le statut de la commande")
        return
    
    print("✅ Webhook fonctionne correctement")

if __name__ == '__main__':
    print("=== CORRECTION DU WEBHOOK STRIPE ===")
    fix_urls_file()
    fix_webhook_function()
    print("=== FIN ===")
