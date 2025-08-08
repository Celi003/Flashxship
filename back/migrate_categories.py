#!/usr/bin/env python
"""
Script pour migrer les données existantes vers les nouvelles catégories séparées
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from vente.models import Product, Equipment, ProductCategory, EquipmentCategory

def migrate_categories():
    print("Début de la migration des catégories...")
    
    # Créer des catégories par défaut pour les produits
    default_product_categories = [
        {'name': 'Électronique', 'description': 'Produits électroniques et informatiques'},
        {'name': 'Outillage', 'description': 'Outils et équipements de bricolage'},
        {'name': 'Jardinage', 'description': 'Produits pour le jardin et l\'extérieur'},
        {'name': 'Sport', 'description': 'Équipements sportifs et de loisirs'},
        {'name': 'Autre', 'description': 'Autres catégories de produits'},
    ]
    
    # Créer des catégories par défaut pour les équipements
    default_equipment_categories = [
        {'name': 'Machines', 'description': 'Machines et équipements lourds'},
        {'name': 'Outils', 'description': 'Outils professionnels'},
        {'name': 'Transport', 'description': 'Véhicules et équipements de transport'},
        {'name': 'Construction', 'description': 'Équipements de construction'},
        {'name': 'Autre', 'description': 'Autres catégories d\'équipements'},
    ]
    
    # Créer les catégories de produits
    product_categories = {}
    for cat_data in default_product_categories:
        category, created = ProductCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        product_categories[cat_data['name']] = category
        if created:
            print(f"Catégorie produit créée: {cat_data['name']}")
    
    # Créer les catégories d'équipements
    equipment_categories = {}
    for cat_data in default_equipment_categories:
        category, created = EquipmentCategory.objects.get_or_create(
            name=cat_data['name'],
            defaults={'description': cat_data['description']}
        )
        equipment_categories[cat_data['name']] = category
        if created:
            print(f"Catégorie équipement créée: {cat_data['name']}")
    
    # Migrer les produits existants
    products_without_category = Product.objects.filter(category__isnull=True)
    if products_without_category.exists():
        default_product_category = ProductCategory.objects.first()
        if default_product_category:
            products_without_category.update(category=default_product_category)
            print(f"{products_without_category.count()} produits migrés vers la catégorie par défaut")
    
    # Migrer les équipements existants
    equipment_without_category = Equipment.objects.filter(category__isnull=True)
    if equipment_without_category.exists():
        default_equipment_category = EquipmentCategory.objects.first()
        if default_equipment_category:
            equipment_without_category.update(category=default_equipment_category)
            print(f"{equipment_without_category.count()} équipements migrés vers la catégorie par défaut")
    
    print("Migration terminée avec succès!")

if __name__ == '__main__':
    migrate_categories() 