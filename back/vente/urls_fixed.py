from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'equipment', views.EquipmentViewSet)
router.register(r'product-categories', views.ProductCategoryViewSet)
router.register(r'equipment-categories', views.EquipmentCategoryViewSet)
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    # Authentication
    path('login/', views.login_view, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('refresh/', views.refresh_token_view, name='refresh_token'),
    path('user/', views.get_user_info, name='user_info'),
    
    # Cart
    path('cart/', views.cart, name='cart'),
    path('merge-cart/', views.merge_cart, name='merge_cart'),
    
    # Orders
    path('create-order/', views.create_order, name='create_order'),
    path('create_payment_session/', views.create_payment_session, name='create_payment_session'),
    path('stripe-webhook/', views.stripe_webhook, name='stripe_webhook'),
    
    # Admin
    path('admin/orders/<int:order_id>/confirm/', views.confirm_order, name='confirm_order'),
    path('admin/orders/<int:order_id>/reject/', views.reject_order, name='reject_order'),
    path('admin/orders/<int:order_id>/ship/', views.ship_order, name='ship_order'),
    path('admin/orders/<int:order_id>/deliver/', views.deliver_order, name='deliver_order'),
    path('admin/messages/', views.admin_messages, name='admin_messages'),
    path('admin/messages/<int:message_id>/respond/', views.respond_to_message, name='respond_to_message'),
    
    # Contact
    path('contact/', views.contact, name='contact'),
    
    # Router URLs
    path('', include(router.urls)),
]
