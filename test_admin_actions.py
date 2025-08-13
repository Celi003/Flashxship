#!/usr/bin/env python3
"""
Script pour tester les actions d'admin et le webhook Stripe
"""

import os
import django
import requests
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from vente.models import Order, ProductCategory, Product
from django.contrib.auth.models import User as AuthUser

def test_admin_actions():
    print("=== TEST DES ACTIONS D'ADMIN ===")
    
    # 1. Vérifier les utilisateurs admin
    print("\n1. Utilisateurs admin")
    admin_users = AuthUser.objects.filter(is_staff=True)
    if admin_users.exists():
        for user in admin_users:
            print(f"   - {user.username} (Staff: {user.is_staff}, Super: {user.is_superuser})")
    else:
        print("   ❌ Aucun utilisateur admin trouvé")
        return
    
    # 2. Créer une commande si aucune n'existe
    print("\n2. Commandes dans la base")
    orders = Order.objects.all()
    if not orders.exists():
        # Créer un utilisateur client
        client, _ = AuthUser.objects.get_or_create(username='client', defaults={'email': 'client@example.com'})
        client.set_password('client123')
        client.save()

        # Créer catégorie et produit minimal
        cat, _ = ProductCategory.objects.get_or_create(name='Général')
        prod, _ = Product.objects.get_or_create(name='Produit test', defaults={'price': 10, 'category': cat, 'stock': 100})

        # Créer la commande
        order = Order.objects.create(user=client, total_amount=10, status='PENDING', payment_status='PENDING')
        orders = Order.objects.all()
    if orders.exists():
        for order in orders:
            print(f"   - Commande #{order.id}: {order.user.username if order.user else 'N/A'} - {order.status} - {order.payment_status}")
    else:
        print("   Aucune commande trouvée")
        return
    
    # 3. Créer/Tester la connexion admin
    print("\n3. Test connexion admin")
    try:
        # S'assurer qu'un admin existe et a le bon mot de passe
        admin = admin_users.first() or AuthUser.objects.create_user(username='admin', email='admin@example.com', password='admin123')
        admin.is_staff = True
        admin.is_superuser = True
        admin.set_password('admin123')
        admin.save()
        login_data = {
            'username': admin_users.first().username,
            'password': 'admin123'  # Mot de passe par défaut
        }
        
        response = requests.post('http://localhost:8000/login/', json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"   ✅ Connexion réussie")
            print(f"   Token: {token[:50]}...")
            
            # 4. Tester les actions d'admin
            print("\n4. Test actions d'admin")
            headers = {'Authorization': f'Bearer {token}'}
            
            # Prendre la première commande pour tester
            test_order = orders.first()
            
            # Test confirmation
            print(f"   Test confirmation commande #{test_order.id}...")
            confirm_response = requests.post(
                f'http://localhost:8000/api/admin/orders/{test_order.id}/confirm/',
                headers=headers
            )
            print(f"   Réponse confirmation: {confirm_response.status_code}")
            if confirm_response.status_code == 200:
                print(f"   ✅ Commande confirmée")
                # Recharger la commande pour voir le changement
                test_order.refresh_from_db()
                print(f"   Nouveau statut: {test_order.status}")
            else:
                print(f"   ❌ Erreur: {confirm_response.text}")
            
            # Test expédition
            print(f"   Test expédition commande #{test_order.id}...")
            ship_response = requests.post(
                f'http://localhost:8000/api/admin/orders/{test_order.id}/ship/',
                headers=headers
            )
            print(f"   Réponse expédition: {ship_response.status_code}")
            if ship_response.status_code == 200:
                print(f"   ✅ Commande expédiée")
                test_order.refresh_from_db()
                print(f"   Nouveau statut: {test_order.status}")
            else:
                print(f"   ❌ Erreur: {ship_response.text}")
            
            # Test livraison
            print(f"   Test livraison commande #{test_order.id}...")
            deliver_response = requests.post(
                f'http://localhost:8000/api/admin/orders/{test_order.id}/deliver/',
                headers=headers
            )
            print(f"   Réponse livraison: {deliver_response.status_code}")
            if deliver_response.status_code == 200:
                print(f"   ✅ Commande livrée")
                test_order.refresh_from_db()
                print(f"   Nouveau statut: {test_order.status}")
            else:
                print(f"   ❌ Erreur: {deliver_response.text}")
                
        else:
            print(f"   ❌ Échec de connexion: {response.status_code}")
            print(f"   Erreur: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Erreur lors du test: {e}")
        import traceback
        traceback.print_exc()

def test_webhook():
    print("\n=== TEST WEBHOOK STRIPE ===")
    
    # Vérifier si l'URL du webhook est accessible
    try:
        response = requests.post('http://localhost:8000/stripe-webhook/', json={})
        print(f"Webhook accessible: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Webhook accessible (400 attendu pour payload invalide)")
        else:
            print(f"⚠️ Statut inattendu: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur accès webhook: {e}")

def main():
    print("Test des actions d'admin et du webhook Stripe")
    
    # Vérifier que le backend fonctionne
    try:
        response = requests.get('http://localhost:8000/docs/', timeout=5)
        if response.status_code == 200:
            print("✅ Backend accessible")
            test_admin_actions()
            test_webhook()
        else:
            print(f"❌ Backend répond avec le code: {response.status_code}")
    except Exception as e:
        print(f"❌ Backend inaccessible: {e}")
        print("Démarrez le backend avec: cd back && python manage.py runserver")
    
    print("\n=== FIN ===")

if __name__ == '__main__':
    main()
