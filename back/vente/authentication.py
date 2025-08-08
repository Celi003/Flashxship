from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
import jwt
import os
from datetime import timedelta
from django.utils import timezone

# Configuration JWT
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            user = User.objects.get(id=payload['user_id'])
            return (user, None)
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
            raise AuthenticationFailed('Token invalide ou expiré')
