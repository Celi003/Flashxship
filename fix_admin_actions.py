#!/usr/bin/env python3
"""
Script pour corriger les actions d'admin dans le frontend
"""

def fix_admin_tsx():
    # Lire le fichier Admin.tsx
    with open('front/src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Vérifier si les fonctions d'action sont présentes
    if 'handleConfirmOrder' not in content:
        print("❌ Fonction handleConfirmOrder manquante")
        return
    
    if 'handleRejectOrder' not in content:
        print("❌ Fonction handleRejectOrder manquante")
        return
    
    if 'handleShipOrder' not in content:
        print("❌ Fonction handleShipOrder manquante")
        return
    
    if 'handleDeliverOrder' not in content:
        print("❌ Fonction handleDeliverOrder manquante")
        return
    
    print("✅ Toutes les fonctions d'action sont présentes")
    
    # Vérifier si les appels API sont corrects
    if 'orderService.confirm' not in content:
        print("❌ Appel API confirm manquant")
        return
    
    if 'orderService.reject' not in content:
        print("❌ Appel API reject manquant")
        return
    
    if 'orderService.ship' not in content:
        print("❌ Appel API ship manquant")
        return
    
    if 'orderService.deliver' not in content:
        print("❌ Appel API deliver manquant")
        return
    
    print("✅ Tous les appels API sont présents")

def check_api_service():
    # Lire le fichier api.ts
    with open('front/src/services/api.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Vérifier si les méthodes d'admin sont présentes
    methods = ['confirm', 'reject', 'ship', 'deliver']
    for method in methods:
        if f'{method}:' not in content:
            print(f"❌ Méthode {method} manquante dans orderService")
            return
    
    print("✅ Toutes les méthodes d'admin sont présentes dans orderService")

if __name__ == '__main__':
    print("=== VÉRIFICATION DES ACTIONS D'ADMIN ===")
    fix_admin_tsx()
    check_api_service()
    print("=== FIN ===")
