#!/usr/bin/env python3
"""
Script de correction automatique pour les boutons d'action d'admin
"""

def add_missing_functions():
    print("=== AJOUT DES FONCTIONS MANQUANTES ===")
    
    try:
        # Lire le fichier Admin.tsx
        with open('front/src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Vérifier si les fonctions existent déjà
        if 'handleConfirmOrder' in content:
            print("✅ Fonctions d'action déjà présentes")
            return
        
        # Trouver l'endroit où ajouter les fonctions (avant formatPrice)
        if 'const formatPrice = (price: number) => {' not in content:
            print("❌ Impossible de trouver l'endroit pour ajouter les fonctions")
            return
        
        # Préparer les nouvelles fonctions
        new_functions = '''
  // Fonctions de gestion des actions d'admin
  const handleConfirmOrder = async (orderId: number) => {
    try {
      await orderService.confirm(orderId);
      toast.success('Commande confirmée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries(['orders']);
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      toast.error('Erreur lors de la confirmation de la commande');
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    try {
      await orderService.reject(orderId);
      toast.success('Commande rejetée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries(['orders']);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet de la commande');
    }
  };

  const handleShipOrder = async (orderId: number) => {
    try {
      await orderService.ship(orderId);
      toast.success('Commande expédiée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries(['orders']);
    } catch (error) {
      console.error('Erreur lors de l\'expédition:', error);
      toast.error('Erreur lors de l\'expédition de la commande');
    }
  };

  const handleDeliverOrder = async (orderId: number) => {
    try {
      await orderService.deliver(orderId);
      toast.success('Commande livrée avec succès');
      // Rafraîchir la liste des commandes
      queryClient.invalidateQueries(['orders']);
    } catch (error) {
      console.error('Erreur lors de la livraison:', error);
      toast.error('Erreur lors de la livraison de la commande');
    }
  };

'''
        
        # Remplacer dans le contenu
        new_content = content.replace(
            'const formatPrice = (price: number) => {',
            new_functions + '  const formatPrice = (price: number) => {'
        )
        
        # Écrire le fichier modifié
        with open('front/src/pages/Admin.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Fonctions d'action ajoutées")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'ajout des fonctions: {e}")

def add_onclick_handlers():
    print("\n=== AJOUT DES GESTIONNAIRES ONCLICK ===")
    
    try:
        # Lire le fichier Admin.tsx
        with open('front/src/pages/Admin.tsx', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Vérifier si les onClick existent déjà
        if 'onClick={() => handleConfirmOrder(order.id)}' in content:
            print("✅ Gestionnaires onClick déjà présents")
            return
        
        # Ajouter les onClick aux boutons
        replacements = [
            ('<IconButton \n                                    edge="end" \n                                    aria-label="confirm"\n                                    color="success"\n                                    size="small"\n                                  >', '<IconButton \n                                    edge="end" \n                                    aria-label="confirm"\n                                    color="success"\n                                    size="small"\n                                    onClick={() => handleConfirmOrder(order.id)}\n                                  >'),
            ('<IconButton \n                                    edge="end" \n                                    aria-label="reject"\n                                    color="error"\n                                    size="small"\n                                  >', '<IconButton \n                                    edge="end" \n                                    aria-label="reject"\n                                    color="error"\n                                    size="small"\n                                    onClick={() => handleRejectOrder(order.id)}\n                                  >'),
            ('<IconButton \n                                    edge="end" \n                                    aria-label="ship"\n                                    color="primary"\n                                    size="small"\n                                  >', '<IconButton \n                                    edge="end" \n                                    aria-label="ship"\n                                    color="primary"\n                                    size="small"\n                                    onClick={() => handleShipOrder(order.id)}\n                                  >'),
            ('<IconButton \n                                    edge="end" \n                                    aria-label="deliver"\n                                    color="secondary"\n                                    size="small"\n                                  >', '<IconButton \n                                    edge="end" \n                                    aria-label="deliver"\n                                    color="secondary"\n                                    size="small"\n                                    onClick={() => handleDeliverOrder(order.id)}\n                                  >')
        ]
        
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
        
        # Écrire le fichier modifié
        with open('front/src/pages/Admin.tsx', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Gestionnaires onClick ajoutés")
        
    except Exception as e:
        print(f"❌ Erreur lors de l'ajout des onClick: {e}")

def main():
    print("=== CORRECTION AUTOMATIQUE DES BOUTONS D'ADMIN ===")
    add_missing_functions()
    add_onclick_handlers()
    print("\n=== RÉSUMÉ ===")
    print("✅ Fonctions de gestion des actions d'admin ajoutées")
    print("✅ Gestionnaires onClick ajoutés aux boutons")
    print("\nMaintenant les boutons d'action d'admin devraient fonctionner !")
    print("=== FIN ===")

if __name__ == '__main__':
    main()
