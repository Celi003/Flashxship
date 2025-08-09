#!/usr/bin/env python3
"""
Script de test pour vérifier l'authentification JWT côté backend
"""

import os
import sys
import django
import jwt
from datetime import datetime, timedelta

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from django.contrib.auth.models import User
from vente.authentication import JWTAuthentication

def test_jwt_authentication():
    print("=== TEST AUTHENTIFICATION JWT BACKEND ===")
    
    # Créer un utilisateur de test
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"✅ Utilisateur de test créé: {user.username}")
    else:
        print(f"✅ Utilisateur de test existant: {user.username}")
    
    # Générer un token JWT
    from vente.views import generate_access_token
    token = generate_access_token(user)
    print(f"✅ Token JWT généré: {token[:50]}...")
    
    # Créer une requête simulée
    from django.test import RequestFactory
    from django.http import HttpRequest
    
    factory = RequestFactory()
    request = factory.post('/create-order/')
    request.headers = {'Authorization': f'Bearer {token}'}
    
    # Tester l'authentification
    auth = JWTAuthentication()
    try:
        user_auth, _ = auth.authenticate(request)
        if user_auth:
            print(f"✅ Authentification réussie pour: {user_auth.username}")
            print(f"   User ID: {user_auth.id}")
            print(f"   Email: {user_auth.email}")
        else:
            print("❌ Authentification échouée")
    except Exception as e:
        print(f"❌ Erreur d'authentification: {e}")
    
    # Tester avec un token invalide
    request.headers = {'Authorization': 'Bearer invalid_token'}
    try:
        user_auth, _ = auth.authenticate(request)
        if user_auth:
            print("❌ Authentification réussie avec un token invalide (problème)")
        else:
            print("✅ Authentification correctement rejetée avec un token invalide")
    except Exception as e:
        print(f"✅ Erreur d'authentification attendue avec un token invalide: {e}")
    
    print("=== FIN TEST ===")

if __name__ == '__main__':
    test_jwt_authentication()
