#!/usr/bin/env python
"""
Script pour nettoyer et redémarrer l'application FLASHXSHIP
"""
import os
import sys
import subprocess
import time

def print_step(message):
    """Afficher une étape avec formatage"""
    print(f"\n{'='*60}")
    print(f"🔄 {message}")
    print(f"{'='*60}")

def run_command(command, cwd=None, shell=True):
    """Exécuter une commande et afficher le résultat"""
    print(f"📋 Exécution: {command}")
    try:
        result = subprocess.run(command, cwd=cwd, shell=shell, capture_output=True, text=True)
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
    print("🚀 Script de nettoyage et redémarrage FLASHXSHIP")
    print("Ce script va :")
    print("1. Nettoyer la base de données")
    print("2. Initialiser avec des données de test")
    print("3. Démarrer le backend Django")
    print("4. Démarrer le frontend React")
    
    # Étape 1: Nettoyer la base de données
    print_step("Nettoyage de la base de données")
    if not run_command("cd back && python manage.py flush --noinput"):
        print("❌ Échec du nettoyage de la base de données")
        return
    
    # Étape 2: Appliquer les migrations
    print_step("Application des migrations")
    if not run_command("cd back && python manage.py makemigrations"):
        print("❌ Échec de la création des migrations")
        return
    
    if not run_command("cd back && python manage.py migrate"):
        print("❌ Échec de l'application des migrations")
        return
    
    # Étape 3: Initialiser avec des données de test
    print_step("Initialisation avec des données de test")
    if not run_command("cd back && python init_database.py"):
        print("❌ Échec de l'initialisation")
        return
    
    print("\n🎉 Base de données initialisée avec succès!")
    print("\n📋 Données créées :")
    print("✅ Superuser: admin / admin123")
    print("✅ Utilisateur test: testuser / test123")
    print("✅ 5 catégories de produits")
    print("✅ 5 catégories d'équipements")
    print("✅ 5 produits de test")
    print("✅ 5 équipements de test")
    print("✅ 1 commande de test")
    print("✅ 1 message de contact de test")
    
    print("\n💡 Instructions pour nettoyer le stockage local :")
    print("1. Ouvrez clear_storage.html dans votre navigateur")
    print("2. Cliquez sur 'Nettoyer TOUT le stockage'")
    print("3. Rechargez votre application")
    print("4. Connectez-vous avec les identifiants ci-dessus")
    
    print("\n🚀 Démarrage des serveurs...")
    
    # Étape 4: Démarrer le backend
    print_step("Démarrage du backend Django")
    backend_process = subprocess.Popen(
        "cd back && python manage.py runserver",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    print("✅ Backend Django démarré sur http://localhost:8000")
    
    # Attendre un peu pour que le backend démarre
    time.sleep(3)
    
    # Étape 5: Démarrer le frontend
    print_step("Démarrage du frontend React")
    frontend_process = subprocess.Popen(
        "cd front && npm start",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    print("✅ Frontend React démarré sur http://localhost:3000")
    
    print("\n🎉 Application FLASHXSHIP démarrée!")
    print("\n📱 URLs :")
    print("🌐 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:8000/api/")
    print("🔧 Admin Django: http://localhost:8000/admin/")
    
    print("\n🔑 Identifiants de connexion :")
    print("👤 Admin: username=admin, password=admin123")
    print("👤 Test: username=testuser, password=test123")
    
    print("\n⚠️ IMPORTANT :")
    print("N'oubliez pas de nettoyer le stockage local avec clear_storage.html")
    print("pour éviter les problèmes de persistance des anciennes données!")
    
    try:
        # Attendre que les processus se terminent
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Arrêt des serveurs...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Serveurs arrêtés")

if __name__ == '__main__':
    main() 