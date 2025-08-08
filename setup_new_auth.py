#!/usr/bin/env python
"""
Script pour configurer le nouveau système d'authentification JWT
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
    print("🚀 Configuration du nouveau système d'authentification JWT")
    print("Ce script va :")
    print("1. Installer les dépendances JWT")
    print("2. Créer les migrations pour RefreshToken")
    print("3. Appliquer les migrations")
    print("4. Créer un superuser")
    print("5. Démarrer les serveurs")
    
    # Étape 1: Installer les dépendances
    print_step("Installation des dépendances")
    if not run_command("cd back && pip install -r requirements.txt"):
        print("❌ Échec de l'installation des dépendances")
        return
    
    # Étape 2: Créer les migrations
    print_step("Création des migrations")
    if not run_command("cd back && python manage.py makemigrations"):
        print("❌ Échec de la création des migrations")
        return
    
    # Étape 3: Appliquer les migrations
    print_step("Application des migrations")
    if not run_command("cd back && python manage.py migrate"):
        print("❌ Échec de l'application des migrations")
        return
    
    # Étape 4: Créer un superuser
    print_step("Création d'un superuser")
    print("🔑 Création du compte administrateur...")
    print("Username: admin")
    print("Email: admin@flashxship.co")
    print("Password: admin123")
    
    # Créer le superuser via un script Python
    create_superuser_script = '''
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from django.contrib.auth.models import User

# Créer le superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@flashxship.co', 'admin123')
    print("✅ Superuser créé avec succès")
else:
    print("⚠️ Superuser existe déjà")
'''
    
    with open('back/create_superuser.py', 'w') as f:
        f.write(create_superuser_script)
    
    if not run_command("cd back && python create_superuser.py"):
        print("❌ Échec de la création du superuser")
        return
    
    # Nettoyer le fichier temporaire
    os.remove('back/create_superuser.py')
    
    print("\n🎉 Configuration terminée!")
    print("\n📋 Résumé :")
    print("✅ Dépendances JWT installées")
    print("✅ Modèle RefreshToken créé")
    print("✅ Migrations appliquées")
    print("✅ Superuser créé")
    
    print("\n🔑 Identifiants de connexion :")
    print("👤 Admin: username=admin, password=admin123")
    
    print("\n💡 Nouveau système d'authentification :")
    print("✅ Token d'accès (1 heure)")
    print("✅ Token de rafraîchissement (7 jours)")
    print("✅ Déconnexion automatique après expiration")
    print("✅ Panier persistant dans localStorage")
    
    print("\n🚀 Démarrage des serveurs...")
    
    # Étape 5: Démarrer le backend
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
    
    # Étape 6: Démarrer le frontend
    print_step("Démarrage du frontend React")
    frontend_process = subprocess.Popen(
        "cd front && npm start",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    print("✅ Frontend React démarré sur http://localhost:3000")
    
    print("\n🎉 Application FLASHXSHIP avec JWT démarrée!")
    print("\n📱 URLs :")
    print("🌐 Frontend: http://localhost:3000")
    print("🔧 Backend API: http://localhost:8000/api/")
    print("🔧 Admin Django: http://localhost:8000/admin/")
    
    print("\n🔑 Identifiants de connexion :")
    print("👤 Admin: username=admin, password=admin123")
    
    print("\n⚠️ IMPORTANT :")
    print("Le nouveau système utilise des tokens JWT au lieu des sessions.")
    print("Les tokens expirent automatiquement pour la sécurité.")
    print("Le panier est maintenant persistant dans le navigateur.")
    
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