# FlashxShip - Plateforme E-commerce Professionnelle

Plateforme complète de vente et location d'équipements professionnels.

## 🏗️ Architecture

- **Backend** : Django REST Framework (Python)
- **Frontend** : React + TypeScript + Material-UI
- **Base de données** : SQLite (développement) / PostgreSQL (production)
- **Paiements** : Stripe
- **Authentification** : Token-based (Django REST Framework)

## 🚀 Installation et Configuration

### Prérequis
- Python 3.8+
- Node.js 16+
- npm ou yarn

### 1. Backend Django

```bash
cd back
python setup_backend.py
```

Ou manuellement :
```bash
cd back
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend React

```bash
cd front
npm install
npm start
```

## 🔧 Configuration

### Variables d'environnement Backend

Créer un fichier `.env` dans le dossier `back/` :

```env
DEBUG=True
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### Variables d'environnement Frontend

Créer un fichier `.env` dans le dossier `front/` :

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## 📱 Fonctionnalités

### Frontend
- ✅ Page d'accueil moderne avec animations
- ✅ Catalogue de produits avec filtres
- ✅ Système de location d'équipements
- ✅ Panier intelligent avec gestion des quantités
- ✅ Authentification complète
- ✅ Design responsive
- ✅ Interface en français

### Backend
- ✅ API REST complète
- ✅ Authentification par token
- ✅ Gestion des produits et équipements
- ✅ Système de panier
- ✅ Intégration Stripe
- ✅ Documentation API (Swagger)

## 🔗 URLs importantes

### Backend
- **API** : http://localhost:8000/api/
- **Admin** : http://localhost:8000/admin/
- **Documentation** : http://localhost:8000/docs/

### Frontend
- **Application** : http://localhost:3000/
- **Produits** : http://localhost:3000/products
- **Location** : http://localhost:3000/equipment
- **Panier** : http://localhost:3000/cart

## 🛠️ Résolution des problèmes

### Erreurs CORS
Si vous voyez des erreurs CORS, assurez-vous que :
1. `django-cors-headers` est installé
2. `corsheaders` est dans `INSTALLED_APPS`
3. `CorsMiddleware` est dans `MIDDLEWARE`
4. Les origines CORS sont configurées dans `settings.py`

### Erreurs 404 API
Si les endpoints API retournent 404 :
1. Vérifiez que les URLs sont correctement configurées
2. Assurez-vous que le serveur Django est démarré
3. Vérifiez que les migrations sont appliquées

### Problèmes de base de données
```bash
cd back
python manage.py makemigrations
python manage.py migrate
```

## 📊 Structure du projet

```
Flashxship/
├── back/                 # Backend Django
│   ├── back/            # Configuration Django
│   ├── vente/           # Application principale
│   ├── manage.py        # Script de gestion Django
│   └── requirements.txt # Dépendances Python
├── front/               # Frontend React
│   ├── src/            # Code source React
│   ├── public/         # Fichiers publics
│   └── package.json    # Dépendances Node.js
└── README.md           # Ce fichier
```

## 🎯 Développement

### Ajouter de nouveaux produits
1. Accéder à l'admin Django : http://localhost:8000/admin/
2. Créer des catégories
3. Ajouter des produits et équipements

### Modifier le design
1. Éditer les composants dans `front/src/components/`
2. Modifier le thème dans `front/src/App.tsx`
3. Personnaliser les styles dans `front/src/index.css`

### Ajouter de nouvelles fonctionnalités
1. Créer les modèles Django dans `back/vente/models.py`
2. Ajouter les vues API dans `back/vente/views.py`
3. Créer les composants React dans `front/src/pages/`

## 🚀 Déploiement

### Backend (Production)
```bash
# Configurer les variables d'environnement
export DEBUG=False
export SECRET_KEY=your-production-secret-key

# Collecter les fichiers statiques
python manage.py collectstatic

# Utiliser un serveur WSGI (Gunicorn)
pip install gunicorn
gunicorn back.wsgi:application
```

### Frontend (Production)
```bash
npm run build
# Servir les fichiers build/ avec un serveur web
```

## 📄 Licence

Ce projet est développé pour FlashxShip et destiné à un usage commercial.

## 👥 Support

Pour toute question ou problème :
- Vérifiez la documentation API : http://localhost:8000/docs/
- Consultez les logs du serveur Django
- Vérifiez la console du navigateur pour les erreurs frontend

---

**FlashxShip** - Votre partenaire de confiance pour l'équipement professionnel 