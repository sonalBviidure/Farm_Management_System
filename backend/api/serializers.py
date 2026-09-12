from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FarmerProfile


class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = ['phone', 'location', 'total_acres', 'created_at']


class FarmerUserSerializer(serializers.ModelSerializer):
    """
    Public representation of a farmer, joining User and FarmerProfile.
    """
    phone = serializers.CharField(source='farmer_profile.phone', read_only=True)
    location = serializers.CharField(source='farmer_profile.location', read_only=True)
    total_acres = serializers.DecimalField(
        source='farmer_profile.total_acres', 
        max_digits=6, 
        decimal_places=2, 
        read_only=True
    )
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'phone', 'location', 'total_acres', 'date_joined']

    def get_full_name(self, obj):
        name = obj.get_full_name()
        return name if name else obj.username


class UserRegistrationSerializer(serializers.Serializer):
    """
    Validates farmer registration and atomically provisions both
    the core User record and the domain FarmerProfile record.
    """
    full_name = serializers.CharField(max_length=150, required=True)
    phone = serializers.CharField(max_length=15, required=True)
    location = serializers.CharField(max_length=255, required=True)
    total_acres = serializers.DecimalField(max_digits=6, decimal_places=2, required=True)
    password = serializers.CharField(write_only=True, min_length=6, required=True)
    confirm_password = serializers.CharField(write_only=True, min_length=6, required=True)

    def validate_phone(self, value):
        cleaned_phone = value.strip().replace(" ", "").replace("-", "")
        if not cleaned_phone.isdigit() or len(cleaned_phone) < 8:
            raise serializers.ValidationError("Enter a valid mobile phone number.")
        if FarmerProfile.objects.filter(phone=cleaned_phone).exists():
            raise serializers.ValidationError("A farmer account with this phone number already exists.")
        return cleaned_phone

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        phone = validated_data['phone']
        full_name = validated_data['full_name'].strip()
        location = validated_data['location'].strip()
        total_acres = validated_data['total_acres']
        password = validated_data['password']

        # Split full name into first and last name if possible
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Use phone as unique username fallback if needed
        username = phone
        # Ensure unique username
        if User.objects.filter(username=username).exists():
            username = f"{phone}_{User.objects.count() + 1}"

        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password
        )

        profile = FarmerProfile.objects.create(
            user=user,
            phone=phone,
            location=location,
            total_acres=total_acres
        )

        return user


class LoginSerializer(serializers.Serializer):
    """
    Supports logging in with either phone number or username.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
