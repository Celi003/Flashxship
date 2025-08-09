#!/usr/bin/env python3
"""
Script pour vérifier les commandes dans la base de données
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from vente.models import Order, OrderItem, User
from django.contrib.auth.models import User as AuthUser

def check_orders():
    print("=== VÉRIFICATION DES COMMANDES ===")
    
    # Vérifier les utilisateurs
    print("\n--- Utilisateurs ---")
    users = AuthUser.objects.all()
    for user in users:
        print(f"ID: {user.id}, Username: {user.username}, Staff: {user.is_staff}, Superuser: {user.is_superuser}")
    
    # Vérifier les commandes
    print("\n--- Commandes ---")
    orders = Order.objects.all().order_by('-created_at')
    if orders.exists():
        for order in orders:
            print(f"\nCommande #{order.id}:")
            print(f"  Utilisateur: {order.user.username if order.user else 'N/A'}")
            print(f"  Total: {order.total_amount}€")
            print(f"  Statut: {order.status}")
            print(f"  Paiement: {order.payment_status}")
            print(f"  Créée le: {order.created_at}")
            print(f"  Livraison: {order.requires_delivery}")
            if order.requires_delivery:
                print(f"  Adresse: {order.delivery_address}, {order.delivery_city}")
                print(f"  Destinataire: {order.recipient_name}")
            
            # Vérifier les éléments de la commande
            items = OrderItem.objects.filter(order=order)
            if items.exists():
                print(f"  Éléments ({items.count()}):")
                for item in items:
                    if hasattr(item, 'product') and item.product:
                        print(f"    - {item.product.name} (x{item.quantity}) - {item.price}€")
                    elif hasattr(item, 'equipment') and item.equipment:
                        print(f"    - {item.equipment.name} (x{item.quantity}, {item.rental_days} jours) - {item.price}€/jour")
    else:
        print("Aucune commande trouvée dans la base de données")
    
    print("\n=== FIN VÉRIFICATION ===")

if __name__ == '__main__':
    check_orders()
