from django.urls import path
from .views import (
    api_status,
    register_farmer,
    login_farmer,
    farmer_profile,
    logout_farmer,
)

urlpatterns = [
    path('status/', api_status, name='api-status'),
    path('auth/register/', register_farmer, name='auth-register'),
    path('auth/login/', login_farmer, name='auth-login'),
    path('auth/profile/', farmer_profile, name='auth-profile'),
    path('auth/logout/', logout_farmer, name='auth-logout'),
]
