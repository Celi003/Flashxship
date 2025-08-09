#!/usr/bin/env python3
"""
Script simple pour tester l'authentification JWT
"""

import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from vente.views import generate_access_token
from django.contrib.auth.models import User

def test_simple():
    print("=== TEST SIMPLE AUTHENTIFICATION ===")
    
    # Vérifier si l'utilisateur admin existe
    try:
        admin_user = User.objects.get(username='admin')
        print(f"✅ Utilisateur admin trouvé: {admin_user.username}")
        print(f"   Staff: {admin_user.is_staff}")
        print(f"   Superuser: {admin_user.is_superuser}")
        
        # Générer un token
        token = generate_access_token(admin_user)
        print(f"✅ Token généré: {token[:50]}...")
        
        # Vérifier le token
        import jwt
        from back.settings import JWT_SECRET_KEY, JWT_ALGORITHM
        
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            print(f"✅ Token décodé avec succès")
            print(f"   User ID: {payload.get('user_id')}")
            print(f"   Username: {payload.get('username')}")
            print(f"   Exp: {payload.get('exp')}")
        except Exception as e:
            print(f"❌ Erreur décodage token: {e}")
            
    except User.DoesNotExist:
        print("❌ Utilisateur admin non trouvé")
        print("Créer un utilisateur admin avec: python manage.py createsuperuser")
    
    print("=== FIN TEST ===")

if __name__ == '__main__':
    test_simple()
