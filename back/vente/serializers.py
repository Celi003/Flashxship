from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
import uuid

class RefreshTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefreshToken
        fields = ['token', 'expires_at']

class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Image
        fields = ['id', 'image', 'image_url', 'uploaded_at']
    
    def get_image_url(self, obj):
        if obj.image:
            try:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                # Fallback: construire l'URL manuellement
                return f"http://localhost:8000{obj.image.url}"
            except Exception as e:
        
                return f"http://localhost:8000{obj.image.url}"
        return None

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'description']

class EquipmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentCategory
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=ProductCategory.objects.all(), source='category', write_only=True)
    images = ImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False, max_length=5)
    existing_image_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'category', 'category_id', 'images', 'image_files', 'existing_image_ids', 'stock', 'created_at']

    def create(self, validated_data):
        image_files = validated_data.pop('image_files', [])
        product = Product.objects.create(**validated_data)
        for image_file in image_files:
            if product.images.count() < 5:
                image = Image.objects.create(image=image_file)
                product.images.add(image)
        return product

    def update(self, instance, validated_data):
        image_files = validated_data.pop('image_files', [])
        existing_image_ids = validated_data.pop('existing_image_ids', [])
        
        # Supprimer toutes les images existantes qui ne sont pas dans existing_image_ids
        if existing_image_ids:
            instance.images.remove(*instance.images.exclude(id__in=existing_image_ids))
        else:
            # Si aucune image existante n'est spécifiée, supprimer toutes les images
            instance.images.clear()
        
        # Mettre à jour les autres champs
        instance = super().update(instance, validated_data)
        
        # Ajouter les nouvelles images
        for image_file in image_files:
            if instance.images.count() < 5:
                image = Image.objects.create(image=image_file)
                instance.images.add(image)
        
        return instance

class EquipmentSerializer(serializers.ModelSerializer):
    category = EquipmentCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=EquipmentCategory.objects.all(), source='category', write_only=True)
    images = ImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False, max_length=5)
    existing_image_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = Equipment
        fields = ['id', 'name', 'description', 'rental_price_per_day', 'category', 'category_id', 'images', 'image_files', 'existing_image_ids', 'available', 'created_at']

    def create(self, validated_data):
        image_files = validated_data.pop('image_files', [])
        equipment = Equipment.objects.create(**validated_data)
        for image_file in image_files:
            if equipment.images.count() < 5:
                image = Image.objects.create(image=image_file)
                equipment.images.add(image)
        return equipment

    def update(self, instance, validated_data):
        image_files = validated_data.pop('image_files', [])
        existing_image_ids = validated_data.pop('existing_image_ids', [])
        
        # Supprimer toutes les images existantes qui ne sont pas dans existing_image_ids
        if existing_image_ids:
            instance.images.remove(*instance.images.exclude(id__in=existing_image_ids))
        else:
            # Si aucune image existante n'est spécifiée, supprimer toutes les images
            instance.images.clear()
        
        # Mettre à jour les autres champs
        instance = super().update(instance, validated_data)
        
        # Ajouter les nouvelles images
        for image_file in image_files:
            if instance.images.count() < 5:
                image = Image.objects.create(image=image_file)
                instance.images.add(image)
        
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    equipment = EquipmentSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'equipment', 'quantity', 'rental_days', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'created_at', 'updated_at', 'status', 'payment_status', 
            'total_amount', 'items', 'requires_delivery', 'delivery_country', 
            'delivery_address', 'delivery_city', 'delivery_postal_code', 
            'delivery_phone', 'recipient_name', 'recipient_email', 'recipient_phone',
            'stripe_session_id', 'stripe_payment_intent_id'
        ]

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'user', 'name', 'email', 'subject', 'message', 'created_at', 'responded', 'admin_response', 'responded_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2', 'is_staff', 'is_superuser']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    rating_display = serializers.CharField(source='get_rating_display', read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'name', 'email', 'company', 'rating', 'rating_display', 'comment', 'is_approved', 'created_at']
        read_only_fields = ['user', 'is_approved', 'created_at']
    
    def create(self, validated_data):
        # Si l'utilisateur est connecté, l'associer automatiquement
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            validated_data['name'] = request.user.get_full_name() or request.user.username
            validated_data['email'] = request.user.email
        
        # Approuver automatiquement les avis pour qu'ils s'affichent immédiatement
        validated_data['is_approved'] = True
        
        return super().create(validated_data)