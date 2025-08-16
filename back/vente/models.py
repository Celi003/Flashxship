from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

class RefreshToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Token expire après 7 jours
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def __str__(self):
        return f"RefreshToken for {self.user.username} - Expires: {self.expires_at}"

class ProductCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Product Category: {self.name}"

class EquipmentCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Equipment Category: {self.name}"

class Image(models.Model):
    image = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id}"

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    images = models.ManyToManyField(Image, blank=True)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def add_image(self, image):
        if self.images.count() >= 5:
            raise ValueError("Cannot add more than 5 images")
        self.images.add(image)

class Equipment(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(null=True)
    rental_price_per_day = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(EquipmentCategory, on_delete=models.CASCADE)
    images = models.ManyToManyField(Image, blank=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def add_image(self, image):
        if self.images.count() >= 5:
            raise ValueError("Cannot add more than 5 images")
        self.images.add(image)

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('CONFIRMED', 'Confirmée'),
        ('REJECTED', 'Rejetée'),
        ('SHIPPED', 'Expédiée'),
        ('DELIVERED', 'Livrée'),
        ('CANCELLED', 'Annulée'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('PENDING', 'En attente de paiement'),
        ('PAID', 'Payé'),
        ('FAILED', 'Échec du paiement'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    
    # Informations de livraison
    requires_delivery = models.BooleanField(default=False)
    delivery_country = models.CharField(max_length=100, blank=True)
    delivery_address = models.TextField(blank=True)
    delivery_city = models.CharField(max_length=100, blank=True)
    delivery_postal_code = models.CharField(max_length=20, blank=True)
    delivery_phone = models.CharField(max_length=20, blank=True)
    
    # Informations du destinataire (si différent de l'utilisateur)
    recipient_name = models.CharField(max_length=200, blank=True)
    recipient_email = models.EmailField(blank=True)
    recipient_phone = models.CharField(max_length=20, blank=True)
    
    # Informations de paiement Stripe
    stripe_session_id = models.CharField(max_length=255, blank=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username if self.user else 'Anonymous'}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    rental_days = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Item {self.id} in Order {self.order.id}"

class ContactMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    responded = models.BooleanField(default=False)
    admin_response = models.TextField(blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"

class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 étoile'),
        (2, '2 étoiles'),
        (3, '3 étoiles'),
        (4, '4 étoiles'),
        (5, '5 étoiles'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    company = models.CharField(max_length=100, blank=True, null=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-rating', '-created_at']
    
    def __str__(self):
        return f"Avis de {self.name} - {self.rating} étoiles"
    
    def get_rating_display(self):
        return f"{self.rating} étoile{'s' if self.rating > 1 else ''}"