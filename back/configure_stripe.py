#!/usr/bin/env python3
"""
Script de configuration Stripe pour FLASHXSHIP
Usage: python configure_stripe.py
"""

import os
import sys
import django
from pathlib import Path

# Configuration Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')

# Initialiser Django
django.setup()

from django.conf import settings

def check_stripe_config():
    """Vérifier la configuration Stripe"""
    print("=== Configuration Stripe FLASHXSHIP ===")
    print()
    
    # Vérifier les clés Stripe
    print("🔑 Clés Stripe:")
    if settings.STRIPE_SECRET_KEY and not settings.STRIPE_SECRET_KEY.startswith("sk_test_"):
        print(f"  ❌ STRIPE_SECRET_KEY: {settings.STRIPE_SECRET_KEY[:20]}... (doit commencer par sk_test_)")
    else:
        print(f"  ✅ STRIPE_SECRET_KEY: {settings.STRIPE_SECRET_KEY[:20]}...")
    
    if settings.STRIPE_PUBLIC_KEY and not settings.STRIPE_PUBLIC_KEY.startswith("pk_test_"):
        print(f"  ❌ STRIPE_PUBLIC_KEY: {settings.STRIPE_PUBLIC_KEY[:20]}... (doit commencer par pk_test_)")
    else:
        print(f"  ✅ STRIPE_PUBLIC_KEY: {settings.STRIPE_PUBLIC_KEY[:20]}...")
    
    # Vérifier le webhook secret
    print("\n🔐 Webhook Secret:")
    if settings.STRIPE_WEBHOOK_SECRET == "whsec_your_webhook_secret_here":
        print("  ❌ STRIPE_WEBHOOK_SECRET: Non configuré (valeur par défaut)")
        print("     → Configurez-le dans votre fichier .env ou settings.py")
    elif not settings.STRIPE_WEBHOOK_SECRET.startswith("whsec_"):
        print(f"  ❌ STRIPE_WEBHOOK_SECRET: Format invalide ({settings.STRIPE_WEBHOOK_SECRET[:20]}...)")
        print("     → Doit commencer par 'whsec_'")
    else:
        print(f"  ✅ STRIPE_WEBHOOK_SECRET: {settings.STRIPE_WEBHOOK_SECRET[:20]}...")
    
    # Vérifier l'URL frontend
    print("\n🌐 Configuration Frontend:")
    print(f"  FRONTEND_URL: {settings.FRONTEND_URL}")
    
    print("\n" + "=" * 50)
    
    # Recommandations
    if settings.STRIPE_WEBHOOK_SECRET == "whsec_your_webhook_secret_here":
        print("\n🚨 PROBLÈME DÉTECTÉ: Webhook secret non configuré")
        print("\nPour résoudre ce problème:")
        print("1. Allez sur https://dashboard.stripe.com/webhooks")
        print("2. Créez un webhook vers: https://votre-domaine.com/stripe-webhook/")
        print("3. Copiez le 'Signing secret' (commence par whsec_)")
        print("4. Mettez-le dans votre fichier .env:")
        print("   STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici")
        print("\nOu utilisez Stripe CLI pour tester en local:")
        print("   stripe listen --forward-to localhost:8000/stripe-webhook/")
    
    print("\n✅ Configuration vérifiée !")

if __name__ == "__main__":
    check_stripe_config()
