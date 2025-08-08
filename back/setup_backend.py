#!/usr/bin/env python3
"""
Script de configuration du backend Django FlashxShip
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Exécute une commande et affiche le résultat"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} - Succès")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} - Erreur")
        print(f"Commande: {command}")
        print(f"Erreur: {e.stderr}")
        return False

def main():
    print("🚀 Configuration du backend Django FlashxShip")
    print("=" * 50)
    
    # Vérifier que nous sommes dans le bon répertoire
    if not os.path.exists('manage.py'):
        print("❌ Erreur: Ce script doit être exécuté depuis le répertoire du backend Django")
        sys.exit(1)
    
    # Installer les dépendances
    if not run_command("pip install -r requirements.txt", "Installation des dépendances"):
        print("❌ Impossible d'installer les dépendances")
        sys.exit(1)
    
    # Appliquer les migrations
    if not run_command("python manage.py makemigrations", "Création des migrations"):
        print("❌ Impossible de créer les migrations")
        sys.exit(1)
    
    if not run_command("python manage.py migrate", "Application des migrations"):
        print("❌ Impossible d'appliquer les migrations")
        sys.exit(1)
    
    # Créer un superutilisateur si nécessaire
    print("\n👤 Création d'un superutilisateur (optionnel)")
    print("Appuyez sur Entrée pour ignorer ou entrez les informations :")
    
    username = input("Nom d'utilisateur (admin): ").strip() or "admin"
    email = input("Email: ").strip()
    password = input("Mot de passe: ").strip()
    
    if password:
        # Créer le superutilisateur
        create_superuser_cmd = f"python manage.py createsuperuser --username {username} --email {email} --noinput"
        if run_command(create_superuser_cmd, "Création du superutilisateur"):
            # Définir le mot de passe
            set_password_cmd = f"python manage.py shell -c \"from django.contrib.auth.models import User; u = User.objects.get(username='{username}'); u.set_password('{password}'); u.save(); print('Superutilisateur créé avec succès')\""
            run_command(set_password_cmd, "Définition du mot de passe")
    
    print("\n✅ Configuration terminée !")
    print("\n📋 Prochaines étapes :")
    print("1. Démarrer le serveur Django : python manage.py runserver")
    print("2. Accéder à l'admin : http://localhost:8000/admin")
    print("3. Tester l'API : http://localhost:8000/docs")
    print("4. Le frontend React devrait maintenant pouvoir se connecter !")

if __name__ == "__main__":
    main() 