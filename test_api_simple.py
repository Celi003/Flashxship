import requests
import json

# Test simple de l'API des produits
response = requests.get('http://localhost:8000/api/products/')
print(f"Status: {response.status_code}")

if response.status_code == 200:
    products = response.json()
    print(f"Nombre de produits: {len(products)}")
    
    if products:
        first_product = products[0]
        print(f"\nPremier produit: {first_product['name']}")
        print(f"Images: {first_product.get('images', [])}")
        
        if first_product.get('images'):
            for i, image in enumerate(first_product['images']):
                print(f"  Image {i+1}:")
                print(f"    ID: {image.get('id')}")
                print(f"    Image field: {image.get('image')}")
                print(f"    Image URL: {image.get('image_url')}")
                print(f"    Uploaded at: {image.get('uploaded_at')}")
        else:
            print("  Aucune image")
else:
    print(f"Erreur: {response.text}")
