#!/usr/bin/env python
"""
Script pour tester le nouveau système d'authentification JWT
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_register():
    """Tester l'inscription d'un utilisateur"""
    print("🔄 Test d'inscription...")
    
    data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "test123456",
        "password2": "test123456"
    }
    
    response = requests.post(f"{BASE_URL}/register/", json=data)
    
    if response.status_code == 201:
        print("✅ Inscription réussie")
        return True
    else:
        print(f"❌ Échec de l'inscription: {response.status_code}")
        print(f"Réponse: {response.text}")
        return False

def test_login():
    """Tester la connexion et récupérer les tokens"""
    print("🔄 Test de connexion...")
    
    data = {
        "username": "testuser",
        "password": "test123456"
    }
    
    response = requests.post(f"{BASE_URL}/login/", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Connexion réussie")
        print(f"Token d'accès: {result['access_token'][:20]}...")
        print(f"Token de rafraîchissement: {result['refresh_token'][:20]}...")
        return result
    else:
        print(f"❌ Échec de la connexion: {response.status_code}")
        print(f"Réponse: {response.text}")
        return None

def test_user_info(access_token):
    """Tester la récupération des informations utilisateur"""
    print("🔄 Test des informations utilisateur...")
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    response = requests.get(f"{BASE_URL}/user/", headers=headers)
    
    if response.status_code == 200:
        user_info = response.json()
        print("✅ Informations utilisateur récupérées")
        print(f"Utilisateur: {user_info['username']}")
        print(f"Email: {user_info['email']}")
        return True
    else:
        print(f"❌ Échec de récupération des infos: {response.status_code}")
        return False

def test_refresh_token(refresh_token):
    """Tester le rafraîchissement du token"""
    print("🔄 Test de rafraîchissement du token...")
    
    data = {
        "refresh_token": refresh_token
    }
    
    response = requests.post(f"{BASE_URL}/refresh/", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Token rafraîchi avec succès")
        print(f"Nouveau token: {result['access_token'][:20]}...")
        return result['access_token']
    else:
        print(f"❌ Échec du rafraîchissement: {response.status_code}")
        return None

def test_logout(refresh_token):
    """Tester la déconnexion"""
    print("🔄 Test de déconnexion...")
    
    data = {
        "refresh_token": refresh_token
    }
    
    response = requests.post(f"{BASE_URL}/logout/", json=data)
    
    if response.status_code == 200:
        print("✅ Déconnexion réussie")
        return True
    else:
        print(f"❌ Échec de la déconnexion: {response.status_code}")
        return False

def main():
    """Fonction principale de test"""
    print("🧪 Test du système d'authentification JWT")
    print("=" * 50)
    
    # Test 1: Inscription
    if not test_register():
        print("❌ Arrêt des tests - échec de l'inscription")
        return
    
    print()
    
    # Test 2: Connexion
    login_result = test_login()
    if not login_result:
        print("❌ Arrêt des tests - échec de la connexion")
        return
    
    access_token = login_result['access_token']
    refresh_token = login_result['refresh_token']
    
    print()
    
    # Test 3: Informations utilisateur
    if not test_user_info(access_token):
        print("❌ Échec de récupération des infos utilisateur")
        return
    
    print()
    
    # Test 4: Rafraîchissement du token
    new_access_token = test_refresh_token(refresh_token)
    if not new_access_token:
        print("❌ Échec du rafraîchissement du token")
        return
    
    print()
    
    # Test 5: Vérifier que le nouveau token fonctionne
    if not test_user_info(new_access_token):
        print("❌ Le nouveau token ne fonctionne pas")
        return
    
    print()
    
    # Test 6: Déconnexion
    test_logout(refresh_token)
    
    print()
    print("🎉 Tous les tests sont passés avec succès !")
    print("✅ Le système JWT fonctionne correctement")

if __name__ == '__main__':
    main() 