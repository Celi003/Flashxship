#!/usr/bin/env python
"""
Script rapide pour résoudre le problème des catégories
"""
import subprocess
import os

def run_command(command):
    print(f"📋 {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print("✅ Succès")
    else:
        print(f"❌ Erreur: {result.stderr}")
    return result.returncode == 0

print("🔧 Correction rapide du problème des catégories")
print("=" * 50)

# 1. Installer les dépendances
print("\n1. Installation des dépendances...")
run_command("cd back && pip install -r requirements.txt")

# 2. Créer les migrations
print("\n2. Création des migrations...")
run_command("cd back && python manage.py makemigrations")

# 3. Appliquer les migrations
print("\n3. Application des migrations...")
run_command("cd back && python manage.py migrate")

# 4. Créer un superuser
print("\n4. Création du superuser...")
run_command("cd back && python manage.py createsuperuser --username admin --email admin@test.com --noinput")

# 5. Définir le mot de passe
print("\n5. Définition du mot de passe...")
password_script = '''
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()
from django.contrib.auth.models import User
user = User.objects.get(username='admin')
user.set_password('admin123')
user.save()
print("Mot de passe défini")
'''
with open('back/set_password.py', 'w') as f:
    f.write(password_script)
run_command("cd back && python set_password.py")
run_command("cd back && del set_password.py")

print("\n🎉 Problème résolu !")
print("\n📋 Prochaines étapes:")
print("1. Démarrer le backend: cd back && python manage.py runserver")
print("2. Démarrer le frontend: cd front && npm start")
print("3. Se connecter avec: admin/admin123") 