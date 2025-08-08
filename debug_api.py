#!/usr/bin/env python
"""
Script pour déboguer l'API et voir exactement ce qu'elle retourne
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def debug_endpoint(endpoint):
    """Déboguer un endpoint de l'API"""
    url = f"{BASE_URL}/{endpoint}"
    
    print(f"🔍 Débogage de {url}")
    
    try:
        response = requests.get(url)
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Type de réponse: {type(data)}")
                print(f"Contenu: {json.dumps(data, indent=2, ensure_ascii=False)}")
                
                if isinstance(data, dict):
                    print(f"Clés disponibles: {list(data.keys())}")
                    if 'results' in data:
                        print(f"Nombre d'éléments dans 'results': {len(data['results'])}")
                elif isinstance(data, list):
                    print(f"Nombre d'éléments dans la liste: {len(data)}")
                else:
                    print(f"Type inattendu: {type(data)}")
                    
                return data
                
            except json.JSONDecodeError as e:
                print(f"❌ Erreur JSON: {e}")
                print(f"Contenu brut: {response.text[:500]}")
                return None
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"Contenu: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Impossible de se connecter à {url}")
        return None
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return None

def main():
    """Fonction principale"""
    print("🔍 Débogage de l'API")
    print("=" * 50)
    
    # Test des catégories d'équipements
    print("\n📦 Test des catégories d'équipements:")
    debug_endpoint("equipment-categories/")
    
    print("\n" + "=" * 50)
    
    # Test des catégories de produits
    print("\n📦 Test des catégories de produits:")
    debug_endpoint("product-categories/")
    
    print("\n" + "=" * 50)
    
    # Test des équipements
    print("\n🔧 Test des équipements:")
    debug_endpoint("equipment/")
    
    print("\n" + "=" * 50)
    
    # Test des produits
    print("\n📦 Test des produits:")
    debug_endpoint("products/")

if __name__ == '__main__':
    main() 