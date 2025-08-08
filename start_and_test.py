#!/usr/bin/env python
"""
Script pour démarrer le backend et tester l'API
"""
import subprocess
import time
import requests
import sys
import os

def start_backend():
    """Démarrer le backend Django"""
    print("🚀 Démarrage du backend Django...")
    
    try:
        # Changer vers le dossier back
        os.chdir('back')
        
        # Démarrer le serveur en arrière-plan
        process = subprocess.Popen(
            ['python', 'manage.py', 'runserver'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print("✅ Backend démarré")
        return process
        
    except Exception as e:
        print(f"❌ Erreur lors du démarrage du backend: {e}")
        return None

def test_api():
    """Tester l'API"""
    print("\n🧪 Test de l'API...")
    
    # Attendre que le serveur démarre
    time.sleep(3)
    
    try:
        # Test des catégories d'équipements
        response = requests.get("http://localhost:8000/api/equipment-categories/")
        print(f"Status equipment-categories: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Réponse: {type(data)}")
            if isinstance(data, dict) and 'results' in data:
                print(f"📊 {len(data['results'])} catégories d'équipements")
            elif isinstance(data, list):
                print(f"📊 {len(data)} catégories d'équipements")
        else:
            print(f"❌ Erreur: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter à l'API")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def main():
    """Fonction principale"""
    print("🔧 Démarrage et test du système")
    print("=" * 50)
    
    # Démarrer le backend
    backend_process = start_backend()
    
    if backend_process:
        try:
            # Tester l'API
            test_api()
            
            print("\n✅ Système prêt !")
            print("🌐 Backend: http://localhost:8000")
            print("🔧 API: http://localhost:8000/api/")
            
            # Garder le processus en vie
            print("\n⏸️ Appuyez sur Ctrl+C pour arrêter...")
            backend_process.wait()
            
        except KeyboardInterrupt:
            print("\n🛑 Arrêt du backend...")
            backend_process.terminate()
            print("✅ Backend arrêté")

if __name__ == '__main__':
    main() 