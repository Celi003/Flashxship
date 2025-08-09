#!/usr/bin/env python3
"""
Script pour démarrer le backend et tester l'authentification
"""

import os
import sys
import subprocess
import time
import requests

def start_backend():
    print("=== DÉMARRAGE DU BACKEND ===")
    
    # Vérifier si le backend est déjà en cours d'exécution
    try:
        response = requests.get('http://localhost:8000/api/', timeout=5)
        if response.status_code == 200:
            print("✅ Backend déjà en cours d'exécution")
            return True
    except:
        pass
    
    # Démarrer le backend
    print("Démarrage du serveur Django...")
    try:
        # Changer vers le répertoire backend
        os.chdir('back')
        
        # Démarrer le serveur en arrière-plan
        process = subprocess.Popen([
            sys.executable, 'manage.py', 'runserver', '0.0.0.0:8000'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Attendre que le serveur démarre
        print("Attente du démarrage du serveur...")
        time.sleep(5)
        
        # Vérifier si le serveur fonctionne
        try:
            response = requests.get('http://localhost:8000/api/', timeout=10)
            if response.status_code == 200:
                print("✅ Backend démarré avec succès")
                return True
            else:
                print(f"❌ Backend répond avec le code: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur de connexion au backend: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")
        return False

def test_auth():
    print("\n=== TEST AUTHENTIFICATION ===")
    
    try:
        # Test de connexion
        login_data = {
            'username': 'admin',
            'password': 'admin123'
        }
        
        response = requests.post('http://localhost:8000/login/', json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"✅ Connexion réussie")
            print(f"   Token: {token[:50]}...")
            
            # Test de création de commande
            print("\nTest de création de commande...")
            headers = {'Authorization': f'Bearer {token}'}
            
            order_data = {
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
            
            order_response = requests.post(
                'http://localhost:8000/create-order/',
                json=order_data,
                headers=headers
            )
            
            print(f"   Réponse création commande: {order_response.status_code}")
            if order_response.status_code != 200:
                print(f"   Erreur: {order_response.text}")
            else:
                print(f"   ✅ Commande créée avec succès")
                
        else:
            print(f"❌ Échec de connexion: {response.status_code}")
            print(f"   Erreur: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")

def main():
    print("Script de test et démarrage du backend")
    
    if start_backend():
        test_auth()
    else:
        print("Impossible de démarrer le backend")
    
    print("\n=== FIN ===")

if __name__ == '__main__':
    main() 