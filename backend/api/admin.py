from django.contrib import admin
from .models import FarmerProfile


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'location', 'total_acres', 'created_at')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'phone', 'location')
    list_filter = ('location', 'created_at')
