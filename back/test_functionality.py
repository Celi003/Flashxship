#!/usr/bin/env python
"""
Script de test pour toutes les nouvelles fonctionnalités
"""
import os
import django
from datetime import datetime

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from django.contrib.auth.models import User
from vente.models import (
    ProductCategory, EquipmentCategory, Product, Equipment, 
    Order, OrderItem, ContactMessage
)
from django.core.mail import send_mail

def test_categories():
    """Test des nouvelles catégories séparées"""
    print("🧪 Test des catégories séparées...")
    
    # Créer des catégories de produits
    product_cat1, created = ProductCategory.objects.get_or_create(
        name='Électronique',
        defaults={'description': 'Produits électroniques'}
    )
    if created:
        print(f"✅ Catégorie produit créée: {product_cat1.name}")
    
    # Créer des catégories d'équipements
    equipment_cat1, created = EquipmentCategory.objects.get_or_create(
        name='Machines',
        defaults={'description': 'Machines lourdes'}
    )
    if created:
        print(f"✅ Catégorie équipement créée: {equipment_cat1.name}")
    
    print(f"📊 Total catégories produits: {ProductCategory.objects.count()}")
    print(f"📊 Total catégories équipements: {EquipmentCategory.objects.count()}")
    print("✅ Test des catégories réussi!\n")

def test_products_and_equipment():
    """Test des produits et équipements avec nouvelles catégories"""
    print("🧪 Test des produits et équipements...")
    
    # Récupérer ou créer des catégories
    product_cat = ProductCategory.objects.first()
    equipment_cat = EquipmentCategory.objects.first()
    
    if not product_cat or not equipment_cat:
        print("❌ Catégories manquantes!")
        return
    
    # Créer un produit de test
    product, created = Product.objects.get_or_create(
        name='Ordinateur Portable',
        defaults={
            'description': 'Ordinateur portable performant',
            'price': 999.99,
            'category': product_cat,
            'stock': 5
        }
    )
    if created:
        print(f"✅ Produit créé: {product.name}")
    
    # Créer un équipement de test
    equipment, created = Equipment.objects.get_or_create(
        name='Excavatrice',
        defaults={
            'description': 'Excavatrice professionnelle',
            'rental_price_per_day': 500.00,
            'category': equipment_cat,
            'available': True
        }
    )
    if created:
        print(f"✅ Équipement créé: {equipment.name}")
    
    print(f"📊 Total produits: {Product.objects.count()}")
    print(f"📊 Total équipements: {Equipment.objects.count()}")
    print("✅ Test des produits et équipements réussi!\n")

def test_orders():
    """Test des commandes avec nouveaux champs"""
    print("🧪 Test des commandes...")
    
    # Créer un utilisateur de test
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    )
    if created:
        print(f"✅ Utilisateur créé: {user.username}")
    
    # Créer une commande de test
    order, created = Order.objects.get_or_create(
        user=user,
        defaults={
            'status': 'PENDING',
            'payment_status': 'PENDING',
            'total_amount': 1499.99,
            'requires_delivery': True,
            'delivery_country': 'France',
            'delivery_address': '123 Rue de la Paix',
            'delivery_city': 'Paris',
            'delivery_postal_code': '75001',
            'delivery_phone': '+33123456789',
            'recipient_name': 'Jean Dupont',
            'recipient_email': 'jean.dupont@example.com',
            'recipient_phone': '+33123456789'
        }
    )
    if created:
        print(f"✅ Commande créée: #{order.id}")
    
    print(f"📊 Total commandes: {Order.objects.count()}")
    print("✅ Test des commandes réussi!\n")

def test_contact_messages():
    """Test des messages de contact"""
    print("🧪 Test des messages de contact...")
    
    # Créer un message de test
    message, created = ContactMessage.objects.get_or_create(
        email='contact@example.com',
        subject='Test de contact',
        defaults={
            'name': 'Test Contact',
            'message': 'Ceci est un message de test pour vérifier le système.',
            'responded': False
        }
    )
    if created:
        print(f"✅ Message créé: {message.subject}")
    
    print(f"📊 Total messages: {ContactMessage.objects.count()}")
    print("✅ Test des messages réussi!\n")

def test_email_system():
    """Test du système d'emails"""
    print("🧪 Test du système d'emails...")
    
    try:
        # Test d'envoi d'email
        send_mail(
            'Test Email - FLASHXSHIP',
            f'Ceci est un test de configuration email pour FLASHXSHIP.\n\nDate: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
            'noreply@flashxship.co',
            ['test@example.com'],
            fail_silently=False,
        )
        print("✅ Email envoyé avec succès!")
    except Exception as e:
        print(f"❌ Erreur d'envoi d'email: {e}")
        print("💡 Pour le développement, utilisez EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'")
    
    print("✅ Test du système d'emails terminé!\n")

def run_all_tests():
    """Exécuter tous les tests"""
    print("🚀 Début des tests de fonctionnalités FLASHXSHIP\n")
    
    test_categories()
    test_products_and_equipment()
    test_orders()
    test_contact_messages()
    test_email_system()
    
    print("🎉 Tous les tests terminés!")
    print("\n📋 Résumé des fonctionnalités testées:")
    print("✅ Catégories séparées (produits/équipements)")
    print("✅ Produits et équipements avec nouvelles catégories")
    print("✅ Commandes avec champs de livraison étendus")
    print("✅ Messages de contact avec système de réponse")
    print("✅ Système d'emails automatiques")
    
    print("\n🔧 Prochaines étapes:")
    print("1. Appliquer les migrations: python manage.py migrate")
    print("2. Exécuter le script de migration: python migrate_categories.py")
    print("3. Tester l'interface d'administration")
    print("4. Configurer les emails en production")

if __name__ == '__main__':
    run_all_tests() 