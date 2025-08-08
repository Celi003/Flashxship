#!/usr/bin/env python
"""
Configuration des emails pour Django
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'back.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email_configuration():
    """
    Test de la configuration email
    """
    print("Test de la configuration email...")
    
    try:
        # Test d'envoi d'email
        send_mail(
            'Test Email - FLASHXSHIP',
            'Ceci est un test de configuration email pour FLASHXSHIP.',
            'noreply@flashxship.co',
            ['test@example.com'],
            fail_silently=False,
        )
        print("✅ Configuration email fonctionnelle!")
    except Exception as e:
        print(f"❌ Erreur de configuration email: {e}")
        print("\nPour configurer les emails, ajoutez dans settings.py:")
        print("""
# Configuration Email (pour Gmail)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'votre-email@gmail.com'
EMAIL_HOST_PASSWORD = 'votre-mot-de-passe-app'

# Ou pour les tests en développement
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
        """)

def configure_development_email():
    """
    Configuration pour le développement (emails affichés dans la console)
    """
    print("Configuration email pour le développement...")
    
    # Cette configuration affiche les emails dans la console Django
    # Utile pour le développement et les tests
    settings.EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    
    print("✅ Configuration email de développement activée!")
    print("Les emails seront affichés dans la console Django.")

if __name__ == '__main__':
    configure_development_email()
    test_email_configuration() 