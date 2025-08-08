import requests
import json

# Test de l'API des produits
def test_products():
    try:
        response = requests.get('http://localhost:8000/api/products/')
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Produits récupérés: {len(products)} produits")
            
            for product in products:
                print(f"\n📦 Produit: {product['name']}")
                if product.get('images'):
                    for i, image in enumerate(product['images']):
                        print(f"  🖼️  Image {i+1}: {image.get('image_url', 'Pas d\'URL')}")
                        if image.get('image_url'):
                            # Test de l'URL de l'image
                            img_response = requests.head(image['image_url'])
                            print(f"    Status: {img_response.status_code}")
                else:
                    print("  ❌ Pas d'images")
        else:
            print(f"❌ Erreur: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

# Test de l'API des équipements
def test_equipment():
    try:
        response = requests.get('http://localhost:8000/api/equipment/')
        if response.status_code == 200:
            equipment = response.json()
            print(f"✅ Équipements récupérés: {len(equipment)} équipements")
            
            for item in equipment:
                print(f"\n🔧 Équipement: {item['name']}")
                if item.get('images'):
                    for i, image in enumerate(item['images']):
                        print(f"  🖼️  Image {i+1}: {image.get('image_url', 'Pas d\'URL')}")
                        if image.get('image_url'):
                            # Test de l'URL de l'image
                            img_response = requests.head(image['image_url'])
                            print(f"    Status: {img_response.status_code}")
                else:
                    print("  ❌ Pas d'images")
        else:
            print(f"❌ Erreur: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

if __name__ == "__main__":
    print("🧪 Test des images...")
    print("\n" + "="*50)
    test_products()
    print("\n" + "="*50)
    test_equipment()
