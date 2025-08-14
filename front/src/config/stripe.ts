// Configuration simple pour les commandes
export const ORDER_CONFIG = {
  // URLs de l'API
  createOrderUrl: 'http://localhost:8000/create-order/',
  
  // Configuration des commandes
  orderOptions: {
    currency: 'eur',
    locale: 'fr',
  }
};

// Fonction pour créer une commande simple
export const createOrder = async (items: any[], customerInfo: any, deliveryInfo: any) => {
  try {
    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(ORDER_CONFIG.createOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ajouter le token JWT
      },
      body: JSON.stringify({
        items,
        customer_info: customerInfo,
        delivery_info: deliveryInfo
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
