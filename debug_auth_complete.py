#!/usr/bin/env python3
"""
Script de debug complet pour diagnostiquer le problème d'authentification JWT
"""

import os
import django
import sys

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from vente.views import generate_access_token, create_order
from vente.authentication import JWTAuthentication
from vente.models import Order, OrderItem, User
from django.contrib.auth.models import User as AuthUser
from django.test import RequestFactory
from django.http import HttpRequest
from rest_framework.test import APIRequestFactory
from rest_framework import status
from rest_framework.response import Response

def debug_auth_complete():
    print("=== DEBUG COMPLET AUTHENTIFICATION JWT ===")
    
    # 1. Vérifier la configuration
    print("\n1. Configuration Django")
    try:
        from back.settings import JWT_SECRET_KEY, JWT_ALGORITHM
        print(f"✅ JWT_SECRET_KEY: {JWT_SECRET_KEY[:20]}...")
        print(f"✅ JWT_ALGORITHM: {JWT_ALGORITHM}")
    except ImportError as e:
        print(f"❌ Erreur import settings: {e}")
        return
    
    # 2. Vérifier les utilisateurs
    print("\n2. Utilisateurs dans la base")
    users = AuthUser.objects.all()
    if users.exists():
        for user in users:
            print(f"   - {user.username} (ID: {user.id}, Staff: {user.is_staff}, Super: {user.is_superuser})")
    else:
        print("   ❌ Aucun utilisateur trouvé")
        return
    
    # 3. Tester la génération de token
    print("\n3. Génération de token")
    try:
        admin_user = AuthUser.objects.filter(is_staff=True).first()
        if not admin_user:
            admin_user = users.first()
        
        token = generate_access_token(admin_user)
        print(f"✅ Token généré pour {admin_user.username}: {token[:50]}...")
        
        # 4. Tester l'authentification JWT
        print("\n4. Test authentification JWT")
        auth = JWTAuthentication()
        
        # Créer une requête simulée
        factory = APIRequestFactory()
        request = factory.post('/create-order/')
        request.headers = {'Authorization': f'Bearer {token}'}
        
        try:
            user_auth, _ = auth.authenticate(request)
            if user_auth:
                print(f"✅ Authentification réussie pour: {user_auth.username}")
                print(f"   User ID: {user_auth.id}")
                print(f"   Staff: {user_auth.is_staff}")
            else:
                print("❌ Authentification échouée - utilisateur None")
        except Exception as e:
            print(f"❌ Erreur authentification: {e}")
        
        # 5. Tester la création de commande
        print("\n5. Test création de commande")
        try:
            # Simuler une requête avec utilisateur authentifié
            request.user = admin_user
            
            # Données de test
            test_data = {
                'items': [
                    {
                        'item_type': 'product',
                        'item_id': 1,
                        'quantity': 2,
                        'rental_days': 1
                    }
                ],
                'customer_info': {
                    'name': 'Test User',
                    'email': 'test@example.com'
                },
                'delivery_info': {
                    'requires_delivery': False
                }
            }
            
            # Appeler la vue directement
            from vente.views import create_order
            response = create_order(request)
            
            if hasattr(response, 'status_code'):
                print(f"✅ Réponse de create_order: {response.status_code}")
                if hasattr(response, 'data'):
                    print(f"   Données: {response.data}")
            else:
                print(f"✅ Réponse: {response}")
                
        except Exception as e:
            print(f"❌ Erreur création commande: {e}")
            import traceback
            traceback.print_exc()
        
        # 6. Vérifier les commandes existantes
        print("\n6. Commandes dans la base")
        orders = Order.objects.all()
        if orders.exists():
            for order in orders:
                print(f"   - Commande #{order.id}: {order.user.username if order.user else 'N/A'} - {order.status}")
        else:
            print("   Aucune commande trouvée")
    
    except Exception as e:
        print(f"❌ Erreur générale: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n=== FIN DEBUG ===")

if __name__ == '__main__':
    debug_auth_complete()
