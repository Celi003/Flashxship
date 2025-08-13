import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "back.settings")  # adapte si ton settings s'appelle différemment
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

def create_admin():
    if not User.objects.filter(email="espoiraizonou22@gmail.com").exists():
        admin = User.objects.create(
            email="espoiraizonou22@gmail.com",
            password=make_password("espoir003"),
            is_superuser=True, 
            is_staff=True, 
            first_name="espoir",
            last_name="ESPOIR"
        )
        print(f"Creating administrator '{admin.first_name} {admin.last_name}'")
        
    else:
        print(f"Superuser 'admin@gmail.com' already exists. Skipping creation.")

create_admin()