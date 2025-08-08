/**
 * Fonction pour nettoyer complètement le localStorage
 * Utile après une réinitialisation de la base de données
 */
export const clearAllStorage = () => {
  // Nettoyer le localStorage
  localStorage.clear();
  
  // Nettoyer les cookies de session
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Nettoyer sessionStorage
  sessionStorage.clear();
  
  console.log('✅ Tous les stockages locaux ont été nettoyés');
};

/**
 * Fonction pour nettoyer uniquement les données de l'application
 */
export const clearAppData = () => {
  // Clés spécifiques à l'application
  const appKeys = [
    'cart',
    'user',
    'authToken',
    'sessionid',
    'csrftoken'
  ];
  
  appKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  console.log('✅ Données de l\'application nettoyées');
};

/**
 * Fonction pour vérifier si le localStorage contient des données
 */
export const checkStorageData = () => {
  const localStorageData: Record<string, string | null> = {};
  const sessionStorageData: Record<string, string | null> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      localStorageData[key] = localStorage.getItem(key);
    }
  }
  
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      sessionStorageData[key] = sessionStorage.getItem(key);
    }
  }
  
  console.log('📊 Données localStorage:', localStorageData);
  console.log('📊 Données sessionStorage:', sessionStorageData);
  
  return { localStorageData, sessionStorageData };
}; 