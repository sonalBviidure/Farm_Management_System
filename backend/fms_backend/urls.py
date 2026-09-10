"""
URL configuration for fms_backend project.
Farm Management System - MCA-II Group Project
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
