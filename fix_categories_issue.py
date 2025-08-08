#!/usr/bin/env python
"""
Script pour résoudre le problème des catégories
"""
import subprocess
import os
import sys

def run_command(command, cwd=None):
    """Exécuter une commande"""
    print(f"📋 Exécution: {command}")
    try:
        result = subprocess.run(command, cwd=cwd, shell=True, capture_output=True, text=True)
        if result.stdout:
            print(f"✅ Sortie: {result.stdout}")
        if result.stderr:
            print(f"⚠️ Erreurs: {result.stderr}")
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    """Fonction principale"""
    print("🔧 Résolution du problème des catégories")
    print("=" * 50)
    
    # Étape 1: Installer les dépendances
    print("\n🔄 Étape 1: Installation des dépendances")
    if not run_command("cd back && pip install -r requirements.txt"):
        print("❌ Échec de l'installation des dépendances")
        return
    
    # Étape 2: Créer les migrations
    print("\n🔄 Étape 2: Création des migrations")
    if not run_command("cd back && python manage.py makemigrations"):
        print("❌ Échec de la création des migrations")
        return
    
    # Étape 3: Appliquer les migrations
    print("\n🔄 Étape 3: Application des migrations")
    if not run_command("cd back && python manage.py migrate"):
        print("❌ Échec de l'application des migrations")
        return
    
    # Étape 4: Créer les données de test
    print("\n🔄 Étape 4: Création des données de test")
    if not run_command("python init_test_data.py"):
        print("❌ Échec de la création des données de test")
        return
    
    print("\n🎉 Problème résolu !")
    print("\n📋 Prochaines étapes:")
    print("1. Démarrer le backend: cd back && python manage.py runserver")
    print("2. Démarrer le frontend: cd front && npm start")
    print("3. Tester l'application sur http://localhost:3000")
    
    print("\n🔑 Identifiants de test:")
    print("   - Admin: admin/admin123")
    print("   - Utilisateur test: testuser/test123456")

if __name__ == '__main__':
    main() 