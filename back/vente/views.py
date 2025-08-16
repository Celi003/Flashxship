from django.core.mail import send_mail
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from .models import ProductCategory, EquipmentCategory, Product, Equipment, Order, OrderItem, ContactMessage, Image
from .serializers import (
    ProductCategorySerializer, EquipmentCategorySerializer, ProductSerializer, EquipmentSerializer,
    OrderSerializer, OrderItemSerializer, ContactMessageSerializer,
    UserSerializer, RegisterSerializer
)
from .permissions import IsAdminOrReadOnly
from .authentication import JWTAuthentication
import stripe
import importlib
# Certaines versions de stripe ne chargent pas automatiquement certains sous-modules
try:
    import stripe.checkout as stripe_checkout
except Exception:
    stripe_checkout = importlib.import_module('stripe.checkout')

# S'assurer que stripe._secret est bien importé et attaché
try:
    stripe_secret_mod = importlib.import_module('stripe._secret')
    # Attacher sur le module principal au cas où il serait None
    if getattr(stripe, '_secret', None) is None:
        setattr(stripe, '_secret', stripe_secret_mod)
except Exception:
    # On ignore en cas d'échec, Stripe lèvera une erreur exploitable sinon
    pass
from django.conf import settings
import os
import jwt
import uuid
from datetime import timedelta
from .models import RefreshToken
from .serializers import ReviewSerializer
from .models import Review

# Configuration JWT
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

def generate_access_token(user):
    """Générer un token d'accès (expire en 1 heure)"""
    payload = {
        'user_id': user.id,
        'username': user.username,
        'exp': timezone.now() + timedelta(hours=1),
        'iat': timezone.now()
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def generate_refresh_token(user):
    """Générer un token de rafraîchissement (expire en 7 jours)"""
    # Supprimer les anciens tokens de l'utilisateur
    RefreshToken.objects.filter(user=user, is_active=True).update(is_active=False)
    
    # Créer un nouveau token
    refresh_token = RefreshToken.objects.create(
        user=user,
        token=str(uuid.uuid4())
    )
    return refresh_token.token

def verify_token(request):
    """Vérifier et décoder le token d'accès"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user = User.objects.get(id=payload['user_id'])
        return user
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return None

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [JWTAuthentication]

class EquipmentCategoryViewSet(viewsets.ModelViewSet):
    queryset = EquipmentCategory.objects.all()
    serializer_class = EquipmentCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [JWTAuthentication]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [JWTAuthentication]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Restaurer le stock lors de la suppression
        instance.stock += sum(item.quantity for item in instance.orderitem_set.all())
        instance.save()
        return super().destroy(request, *args, **kwargs)

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAdminOrReadOnly]
    authentication_classes = [JWTAuthentication]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        # Marquer comme disponible lors de la suppression
        instance.available = True
        instance.save()
        return super().destroy(request, *args, **kwargs)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Connexion avec génération de tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username et password requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Générer les tokens
    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)
    
    return Response({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': UserSerializer(user).data,
        'expires_in': 3600  # 1 heure en secondes
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """Rafraîchir le token d'accès"""
    refresh_token = request.data.get('refresh_token')
    
    if not refresh_token:
        return Response({'error': 'Refresh token requis'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Vérifier le refresh token
        token_obj = RefreshToken.objects.get(token=refresh_token, is_active=True)
        
        if token_obj.is_expired():
            token_obj.is_active = False
            token_obj.save()
            return Response({'error': 'Refresh token expiré'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Générer un nouveau token d'accès
        access_token = generate_access_token(token_obj.user)
        
        return Response({
            'access_token': access_token,
            'expires_in': 3600
        })
        
    except RefreshToken.DoesNotExist:
        return Response({'error': 'Refresh token invalide'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Déconnexion - invalider le refresh token"""
    refresh_token = request.data.get('refresh_token')
    
    if refresh_token:
        try:
            token_obj = RefreshToken.objects.get(token=refresh_token, is_active=True)
            token_obj.is_active = False
            token_obj.save()
        except RefreshToken.DoesNotExist:
            pass
    
    return Response({'message': 'Déconnexion réussie'})

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_encode
    from django.utils.encoding import force_bytes
    from django.contrib.auth.models import User
    email = request.data.get('email')
    user = User.objects.filter(email=email).first()
    if user:
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{request.build_absolute_uri('/auth/password-reset-confirm/')}{uid}/{token}/"
        send_mail(
            'Password Reset Request',
            f'Click the link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Password reset email sent'}, status=status.HTTP_200_OK)
    return Response({'error': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request, uidb64, token):
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_decode
    from django.contrib.auth.models import User
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user and default_token_generator.check_token(user, token):
        password = request.data.get('password')
        password2 = request.data.get('password2')
        if password and password == password2:
            user.set_password(password)
            user.save()
            return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def cart(request):
    # Utiliser un identifiant unique pour le panier basé sur l'utilisateur
    if request.user.is_authenticated:
        cart_key = f"cart_user_{request.user.id}"
    else:
        cart_key = f"cart_session_{request.session.session_key or 'anonymous'}"
    
    cart = request.session.get(cart_key, {})
    
    if request.method == 'GET':
        items = []
        total = 0
        for item_id, item_data in cart.items():
            try:
                if item_data['type'] == 'product':
                    product = Product.objects.get(id=item_id)
                    item_total = product.price * item_data['quantity']
                    items.append({
                        'item': ProductSerializer(product).data,
                        'quantity': item_data['quantity'],
                        'total': item_total
                    })
                    total += item_total
                else:
                    equipment = Equipment.objects.get(id=item_id)
                    item_total = equipment.rental_price_per_day * item_data['quantity'] * item_data['days']
                    items.append({
                        'item': EquipmentSerializer(equipment).data,
                        'quantity': item_data['quantity'],
                        'days': item_data['days'],
                        'total': item_total
                    })
                    total += item_total
            except (Product.DoesNotExist, Equipment.DoesNotExist):
                # Supprimer l'élément du panier s'il n'existe plus
                del cart[item_id]
                request.session[cart_key] = cart
                request.session.modified = True
        
        return Response({'items': items, 'total': total})
    
    elif request.method == 'POST':
        item_id = request.data.get('item_id')
        item_type = request.data.get('item_type')
        quantity = int(request.data.get('quantity', 1))
        days = int(request.data.get('days', 1)) if item_type == 'equipment' else 0

        if item_type == 'equipment' and not request.user.is_authenticated:
            return Response({'error': 'You must be logged in to rent equipment'}, status=status.HTTP_401_UNAUTHORIZED)

        cart[item_id] = {
            'type': item_type,
            'quantity': quantity,
            'days': days
        }
        request.session[cart_key] = cart
        request.session.modified = True
        return Response({'message': 'Item added to cart'}, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def contact(request):
    if request.method == 'GET':
        # Récupérer tous les messages de contact (pour l'admin)
        if request.user.is_authenticated and request.user.is_staff:
            messages = ContactMessage.objects.all().order_by('-created_at')
            serializer = ContactMessageSerializer(messages, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    elif request.method == 'POST':
        # Envoyer un nouveau message de contact
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            contact_message = serializer.save(user=request.user if request.user.is_authenticated else None)
            return Response({'message': 'Message sent successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrReadOnly])
def admin_dashboard(request):
    if request.method == 'GET':
        total_products = Product.objects.count()
        total_equipment = Equipment.objects.count()
        total_orders = Order.objects.count()
        total_messages = ContactMessage.objects.filter(responded=False).count()
        
        return Response({
            'total_products': total_products,
            'total_equipment': total_equipment,
            'total_orders': total_orders,
            'pending_messages': total_messages
        })
    return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@permission_classes([IsAdminOrReadOnly])
def respond_message(request, message_id):
    try:
        message = ContactMessage.objects.get(id=message_id)
    except ContactMessage.DoesNotExist:
        return Response({'error': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
    
    response_text = request.data.get('response')
    if response_text:
        send_mail(
            f'Re: {message.subject}',
            response_text,
            settings.DEFAULT_FROM_EMAIL,
            [message.email],
            fail_silently=False,
        )
        message.responded = True
        message.save()
        return Response({'message': 'Response sent successfully'}, status=status.HTTP_200_OK)
    return Response({'error': 'Response text required'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def success(request):
    return Response({'message': 'Payment successful'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    """Créer une commande avec informations de livraison"""
    # Utiliser l'authentification JWT
    from .authentication import JWTAuthentication
    auth = JWTAuthentication()
    user, _ = auth.authenticate(request)
    if not user:
        return Response({'detail': 'Informations d\'authentification non fournies.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    request.user = user
    
    try:
        items = request.data.get('items', [])
        customer_info = request.data.get('customer_info', {})
        delivery_info = request.data.get('delivery_info', {})
        
        if not items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculer le total
        total_amount = 0
        order = Order.objects.create(
            user=request.user,
            total_amount=0,
            session_key=None,
            # Informations de livraison
            requires_delivery=delivery_info.get('requires_delivery', False),
            delivery_country=delivery_info.get('country', ''),
            delivery_address=delivery_info.get('address', ''),
            delivery_city=delivery_info.get('city', ''),
            delivery_postal_code=delivery_info.get('postal_code', ''),
            delivery_phone=delivery_info.get('phone', ''),
            # Informations du destinataire
            recipient_name=delivery_info.get('recipient_name', ''),
            recipient_email=delivery_info.get('recipient_email', ''),
            recipient_phone=delivery_info.get('recipient_phone', '')
        )
        
        for item in items:
            item_id = item['id']
            item_type = item['type']
            quantity = item['quantity']
            days = item.get('days', 1)
            
            if item_type == 'product':
                product = Product.objects.get(id=item_id)
                item_total = product.price * quantity
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price
                )
                
                product.stock -= quantity
                product.save()
                total_amount += item_total
                
            elif item_type == 'equipment':
                equipment = Equipment.objects.get(id=item_id)
                item_total = equipment.rental_price_per_day * quantity * days
                
                OrderItem.objects.create(
                    order=order,
                    equipment=equipment,
                    quantity=quantity,
                    rental_days=days,
                    price=equipment.rental_price_per_day
                )
                
                equipment.available = False
                equipment.save()
                total_amount += item_total

        order.total_amount = total_amount
        order.status = 'PENDING'
        order.payment_status = 'PENDING'
        order.save()
        
        return Response({
            'order_id': order.id,
            'total_amount': total_amount,
            'message': 'Order created successfully'
        }, status=status.HTTP_201_CREATED)
        
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Equipment.DoesNotExist:
        return Response({'error': 'Equipment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Error creating order: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

 

@api_view(['DELETE'])
def clear_cart(request):
    """Vider le panier de l'utilisateur"""
    if request.user.is_authenticated:
        cart_key = f"cart_user_{request.user.id}"
    else:
        cart_key = f"cart_session_{request.session.session_key or 'anonymous'}"
    
    if cart_key in request.session:
        del request.session[cart_key]
        request.session.modified = True
    
    return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def merge_cart(request):
    """Fusionner le panier anonyme avec le panier utilisateur lors de la connexion"""
    if not request.user.is_authenticated:
        return Response({'error': 'User must be authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Récupérer le panier anonyme
    anonymous_cart_key = f"cart_session_{request.session.session_key or 'anonymous'}"
    anonymous_cart = request.session.get(anonymous_cart_key, {})
    
    # Récupérer le panier utilisateur
    user_cart_key = f"cart_user_{request.user.id}"
    user_cart = request.session.get(user_cart_key, {})
    
    # Fusionner les paniers
    merged_cart = user_cart.copy()
    for item_id, item_data in anonymous_cart.items():
        if item_id in merged_cart:
            # Si l'item existe déjà, additionner les quantités
            merged_cart[item_id]['quantity'] += item_data['quantity']
            if 'days' in item_data:
                merged_cart[item_id]['days'] = max(merged_cart[item_id].get('days', 1), item_data['days'])
        else:
            # Sinon, ajouter l'item
            merged_cart[item_id] = item_data
    
    # Sauvegarder le panier fusionné
    request.session[user_cart_key] = merged_cart
    
    # Supprimer le panier anonyme
    if anonymous_cart_key in request.session:
        del request.session[anonymous_cart_key]
    
    request.session.modified = True
    
    return Response({'message': 'Cart merged successfully'}, status=status.HTTP_200_OK) 

# Configuration Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def create_payment_session(request):
    """Créer une session de paiement Stripe pour une commande"""
    try:
        order_id = request.data.get('order_id')
        
        if not order_id:
            return Response({'error': 'Order ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Récupérer la commande
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if order.payment_status == 'PAID':
            return Response({'error': 'Order is already paid'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Préparer les items pour Stripe
        line_items = []
        for item in order.items.all():
            if item.product:
                line_items.append({
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': item.product.name,
                        },
                        'unit_amount': int(item.price * 100),  # Stripe utilise les centimes
                    },
                    'quantity': item.quantity,
                })
            elif item.equipment:
                line_items.append({
                    'price_data': {
                        'currency': 'eur',
                        'product_data': {
                            'name': f"{item.equipment.name} (Location {item.rental_days} jours)",
                        },
                        'unit_amount': int(item.price * 100),
                    },
                    'quantity': item.quantity * item.rental_days,
                })
        
        # Vérifier qu'il y a bien des articles à payer
        if not line_items:
            return Response({'error': 'Order has no payable items'}, status=status.HTTP_400_BAD_REQUEST)

        # Construire les paramètres de session
        session_kwargs = {
            'payment_method_types': ['card'],
            'line_items': line_items,
            'mode': 'payment',
            'success_url': f"{settings.FRONTEND_URL}/orders?payment_success=true&order_id={order.id}",
            'cancel_url': f"{settings.FRONTEND_URL}/orders",
            'metadata': {
                'order_id': order.id,
                'user_id': request.user.id,
            },
        }
        if getattr(request.user, 'email', None):
            session_kwargs['customer_email'] = request.user.email

        # Créer la session Stripe via le sous-module explicitement importé, avec reprise si _secret manque
        try:
            session = stripe_checkout.Session.create(**session_kwargs)
        except AttributeError as e:
            # Erreur connue dans certains environnements: stripe._secret est None
            if 'Secret' in str(e):
                try:
                    secret_mod = importlib.import_module('stripe._secret')
                    setattr(stripe, '_secret', secret_mod)
                except Exception:
                    # On laisse remonter l'erreur au deuxième essai
                    pass
                # Second essai après import explicite
                session = stripe_checkout.Session.create(**session_kwargs)
            else:
                raise
        
        # Sauvegarder l'ID de session
        order.stripe_session_id = session.id
        order.save()
        
        return Response({
            'session_id': session.id,
            'url': session.url
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': f'Error creating payment session: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return Response({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return Response({'error': 'Invalid signature'}, status=400)
    except Exception as e:
        return Response({'error': 'Unexpected error'}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session.get('metadata', {}).get('order_id')
        
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                # Mettre à jour le statut de paiement et de commande
                order.payment_status = 'PAID'
                order.status = 'CONFIRMED'
                order.stripe_session_id = session['id']
                order.save()
                
                
            except Order.DoesNotExist:
                pass
            except Exception as e:
                pass

    return Response({'status': 'success'})


# Nouvelles vues pour la gestion des commandes
@api_view(['POST'])
@permission_classes([IsAdminOrReadOnly])
def confirm_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.status = 'CONFIRMED'
        order.save()
        
        # Envoyer un email de confirmation au client
        recipient = order.recipient_email or (order.user.email if order.user and order.user.email else None)
        if recipient:
            send_mail(
                'Commande confirmée - FLASHXSHIP',
                f'Votre commande #{order.id} a été confirmée. Nous vous tiendrons informé de son avancement.',
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flashxship.co'),
                [recipient],
                fail_silently=True,
            )
        
        return Response({'message': 'Commande confirmée'})
    except Order.DoesNotExist:
        return Response({'error': 'Commande non trouvée'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminOrReadOnly])
def reject_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.status = 'REJECTED'
        order.save()
        
        # Envoyer un email de rejet au client
        recipient = order.recipient_email or (order.user.email if order.user and order.user.email else None)
        if recipient:
            send_mail(
                'Commande rejetée - FLASHXSHIP',
                f"Votre commande #{order.id} a été rejetée. Veuillez nous contacter pour plus d'informations.",
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flashxship.co'),
                [recipient],
                fail_silently=True,
            )
        
        return Response({'message': 'Commande rejetée'})
    except Order.DoesNotExist:
        return Response({'error': 'Commande non trouvée'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminOrReadOnly])
def ship_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.status = 'SHIPPED'
        order.save()
        
        # Envoyer un email d'expédition
        recipient = order.recipient_email or (order.user.email if order.user and order.user.email else None)
        if recipient:
            send_mail(
                'Commande expédiée - FLASHXSHIP',
                f'Votre commande #{order.id} a été expédiée. Elle est en cours d\'acheminement.',
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flashxship.co'),
                [recipient],
                fail_silently=True,
            )
        
        return Response({'message': 'Commande expédiée'})
    except Order.DoesNotExist:
        return Response({'error': 'Commande non trouvée'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminOrReadOnly])
def deliver_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.status = 'DELIVERED'
        order.save()
        
        # Envoyer un email de livraison au client
        recipient = order.recipient_email or (order.user.email if order.user and order.user.email else None)
        if recipient:
            send_mail(
                'Commande livrée - FLASHXSHIP',
                f'Votre commande #{order.id} a été livrée. Merci de votre confiance !',
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flashxship.co'),
                [recipient],
                fail_silently=True,
            )
        
        return Response({'message': 'Commande livrée'})
    except Order.DoesNotExist:
        return Response({'error': 'Commande non trouvée'}, status=404)

# Nouvelles vues pour la gestion des messages
@api_view(['GET'])
@permission_classes([IsAdminUser])
@authentication_classes([JWTAuthentication])
def admin_messages(request):
    messages = ContactMessage.objects.all().order_by('-created_at')
    serializer = ContactMessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
@authentication_classes([JWTAuthentication])
def respond_to_message(request, message_id):
    try:
        message = ContactMessage.objects.get(id=message_id)
        response_text = request.data.get('response')
        
        if not response_text:
            return Response({'error': 'Réponse requise'}, status=400)
        
        message.admin_response = response_text
        message.responded = True
        message.responded_at = timezone.now()
        message.save()
        
        # Envoyer l'email de réponse
        send_mail(
            f'Réponse à votre message: {message.subject}',
            f'Bonjour {message.name},\n\n{response_text}\n\nCordialement,\nL\'équipe FLASHXSHIP',
            getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@flashxship.co'),
            [message.email],
            fail_silently=not getattr(settings, 'DEBUG', False),
        )
        
        return Response({'message': 'Réponse envoyée'})
    except ContactMessage.DoesNotExist:
        return Response({'error': 'Message non trouvé'}, status=404) 

@api_view(['GET'])
def get_reviews(request):
    """Récupérer tous les avis approuvés"""
    reviews = Review.objects.filter(is_approved=True)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_reviews(request):
    """Récupérer tous les avis (approuvés et en attente) - pour le débogage"""
    reviews = Review.objects.all().order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_review(request):
    """Créer un nouvel avis"""
    serializer = ReviewSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def manage_review(request, review_id):
    """Gérer un avis (approuver/supprimer) - Admin seulement"""
    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response({'error': 'Avis non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        # Approuver l'avis
        review.is_approved = True
        review.save()
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        review.delete()
        return Response({'message': 'Avis supprimé'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_user_info(request):
    """Obtenir les informations de l'utilisateur connecté"""
    user = verify_token(request)
    if not user:
        return Response({'error': 'Token invalide ou expiré'}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(UserSerializer(user).data) 

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def update_profile(request):
    """Mettre à jour le profil de l'utilisateur connecté"""
    try:
        user = request.user
        
        # Vérifier que l'utilisateur est connecté
        if not user.is_authenticated:
            return Response({'error': 'Utilisateur non connecté'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Récupérer les données de la requête
        username = request.data.get('username')
        email = request.data.get('email')
        
        # Validation des données
        if not username or not email:
            return Response({'error': 'Le nom d\'utilisateur et l\'email sont requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si le nom d'utilisateur est déjà pris par un autre utilisateur
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return Response({'error': 'Ce nom d\'utilisateur est déjà pris'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si l'email est déjà pris par un autre utilisateur
        if User.objects.filter(email=email).exclude(id=user.id).exists():
            return Response({'error': 'Cet email est déjà utilisé'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Mettre à jour l'utilisateur
        user.username = username
        user.email = email
        user.save()
        
        # Retourner les données mises à jour
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': f'Erreur lors de la mise à jour du profil: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 