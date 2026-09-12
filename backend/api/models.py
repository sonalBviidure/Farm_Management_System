from django.db import models
from django.contrib.auth.models import User


class FarmerProfile(models.Model):
    """
    Farmer Profile model extending Django's built-in User.
    Stores agricultural domain fields: phone number, village/district location,
    and total land in acres.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='farmer_profile'
    )
    phone = models.CharField(
        max_length=15, 
        unique=True, 
        db_index=True,
        help_text="Farmer contact phone number (used as unique login credential)"
    )
    location = models.CharField(
        max_length=255, 
        help_text="Village, Taluka, or District"
    )
    total_acres = models.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        default=0.0,
        help_text="Total land holding in acres"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Farmer Profile"
        verbose_name_plural = "Farmer Profiles"
        ordering = ['-created_at']

    def __str__(self):
        full_name = self.user.get_full_name()
        display_name = full_name if full_name else self.user.username
        return f"{display_name} - {self.location} ({self.phone})"

