#!/usr/bin/env python3
"""
Correction rapide pour ajouter le webhook Stripe
"""

def add_webhook_url():
    # Lire le fichier URLs
    with open('back/vente/urls.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Vérifier si le webhook est déjà présent
    if 'stripe-webhook/' in content:
        print("✅ Webhook Stripe déjà présent")
        return
    
    # Ajouter le webhook après create_payment_session
    lines = content.split('\n')
    new_lines = []
    
    for i, line in enumerate(lines):
        new_lines.append(line)
        if 'create_payment_session/' in line:
            # Ajouter le webhook à la ligne suivante
            new_lines.append("    path('stripe-webhook/', views.stripe_webhook, name='stripe_webhook'),")
    
    # Écrire le fichier corrigé
    with open('back/vente/urls.py', 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    
    print("✅ Webhook Stripe ajouté au fichier URLs")

if __name__ == '__main__':
    print("=== AJOUT DU WEBHOOK STRIPE ===")
    add_webhook_url()
    print("=== FIN ===")
