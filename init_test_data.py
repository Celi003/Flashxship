#!/usr/bin/env python
"""
Script pour initialiser la base de données avec des données de test
"""
import os
import django
import sys

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth.models import User
from vente.models import ProductCategory, EquipmentCategory, Product, Equipment

def create_test_data():
    """Créer des données de test"""
    print("🔄 Création des données de test...")
    
    # Créer un superuser si il n'existe pas
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@flashxship.co', 'admin123')
        print("✅ Superuser créé: admin/admin123")
    
    # Créer des catégories de produits
    product_categories = [
        {'name': 'Outils manuels', 'description': 'Outils de base pour tous les travaux'},
        {'name': 'Équipements électriques', 'description': 'Outils électriques professionnels'},
        {'name': 'Matériaux de construction', 'description': 'Matériaux essentiels'},
    ]
    
    for cat_data in product_categories:
        cat, created = ProductCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        if created:
            print(f"✅ Catégorie produit créée: {cat.name}")
    
    # Créer des catégories d'équipements
    equipment_categories = [
        {'name': 'Engins de chantier', 'description': 'Machines lourdes pour chantier'},
        {'name': 'Équipements de levage', 'description': 'Grues et équipements de levage'},
        {'name': 'Véhicules utilitaires', 'description': 'Camions et véhicules de transport'},
    ]
    
    for cat_data in equipment_categories:
        cat, created = EquipmentCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        if created:
            print(f"✅ Catégorie équipement créée: {cat.name}")
    
    # Créer des produits
    products_data = [
        {
            'name': 'Marteau professionnel',
            'description': 'Marteau robuste pour travaux intensifs',
            'price': 25.00,
            'category': ProductCategory.objects.get(name='Outils manuels')
        },
        {
            'name': 'Perceuse électrique',
            'description': 'Perceuse puissante pour tous types de matériaux',
            'price': 89.99,
            'category': ProductCategory.objects.get(name='Équipements électriques')
        },
        {
            'name': 'Ciment Portland',
            'description': 'Sac de ciment 25kg pour construction',
            'price': 12.50,
            'category': ProductCategory.objects.get(name='Matériaux de construction')
        },
    ]
    
    for prod_data in products_data:
        prod, created = Product.objects.get_or_create(
            name=prod_data['name'],
            defaults={
                'description': prod_data['description'],
                'price': prod_data['price'],
                'category': prod_data['category']
            }
        )
        if created:
            print(f"✅ Produit créé: {prod.name} - {prod.price}€")
    
    # Créer des équipements
    equipment_data = [
        {
            'name': 'Mini-pelle',
            'description': 'Mini-pelle pour petits chantiers',
            'rental_price_per_day': 150.00,
            'category': EquipmentCategory.objects.get(name='Engins de chantier')
        },
        {
            'name': 'Grue mobile',
            'description': 'Grue mobile pour levage de charges',
            'rental_price_per_day': 300.00,
            'category': EquipmentCategory.objects.get(name='Équipements de levage')
        },
        {
            'name': 'Camion benne',
            'description': 'Camion benne pour transport de matériaux',
            'rental_price_per_day': 200.00,
            'category': EquipmentCategory.objects.get(name='Véhicules utilitaires')
        },
    ]
    
    for equip_data in equipment_data:
        equip, created = Equipment.objects.get_or_create(
            name=equip_data['name'],
            defaults={
                'description': equip_data['description'],
                'rental_price_per_day': equip_data['rental_price_per_day'],
                'category': equip_data['category']
            }
        )
        if created:
            print(f"✅ Équipement créé: {equip.name} - {equip.rental_price_per_day}€/jour")
    
    print("\n🎉 Données de test créées avec succès !")
    print(f"📊 Résumé:")
    print(f"   - {ProductCategory.objects.count()} catégories de produits")
    print(f"   - {EquipmentCategory.objects.count()} catégories d'équipements")
    print(f"   - {Product.objects.count()} produits")
    print(f"   - {Equipment.objects.count()} équipements")
    print(f"   - {User.objects.count()} utilisateurs")

if __name__ == '__main__':
    create_test_data() 