// Script de test pour vérifier l'état de l'authentification
console.log('=== TEST AUTHENTIFICATION ===');

// Vérifier le localStorage
console.log('localStorage accessToken:', localStorage.getItem('accessToken'));
console.log('localStorage refreshToken:', localStorage.getItem('refreshToken'));
console.log('localStorage user:', localStorage.getItem('user'));

// Vérifier si l'utilisateur est connecté
const token = localStorage.getItem('accessToken');
if (token) {
    console.log('✅ Token trouvé:', token.substring(0, 20) + '...');
    
    // Décoder le token JWT (partie payload)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        console.log('Expiration:', new Date(payload.exp * 1000));
        console.log('Utilisateur ID:', payload.user_id);
        console.log('Username:', payload.username);
    } catch (e) {
        console.log('❌ Erreur décodage token:', e);
    }
} else {
    console.log('❌ Aucun token trouvé');
}

// Vérifier le contexte d'authentification React
if (window.React && window.React.useContext) {
    console.log('React disponible');
} else {
    console.log('React non disponible dans la console');
}

console.log('=== FIN TEST ===');
