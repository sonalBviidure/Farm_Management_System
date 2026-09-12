from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone

from .models import FarmerProfile
from .serializers import (
    UserRegistrationSerializer, 
    FarmerUserSerializer, 
    LoginSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_status(request):
    """
    Health check and module status endpoint.
    """
    db_engine = settings.DATABASES['default']['ENGINE'].split('.')[-1]
    db_name = settings.DATABASES['default']['NAME']

    return Response({
        'status': 'online',
        'project': 'Farm Management System (FMS)',
        'version': '2.0.0 (Phase 2 Authentication)',
        'team': {
            'team_leader': 'Sonali Bhauso Vidure',
            'team_member': 'Shraddha Suresh Gurav'
        },
        'database': {
            'engine': db_engine,
            'configured_for_mysql': settings.USE_MYSQL,
        },
        'server_time': timezone.now().isoformat(),
        'message': 'FMS Backend API with Phase 2 Authentication is operational.'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_farmer(request):
    """
    Register a new farmer account with agricultural profile details.
    Creates User and FarmerProfile, generates Auth Token, and returns profile.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        user_data = FarmerUserSerializer(user).data
        return Response({
            'message': 'Farmer registered successfully',
            'token': token.key,
            'user': user_data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Validation failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_farmer(request):
    """
    Authenticate a farmer using phone number (or username) and password.
    Returns Auth Token and farmer profile.
    """
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'message': 'Invalid input',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    identifier = serializer.validated_data['username'].strip()
    password = serializer.validated_data['password']

    # Resolve user by username first, or by farmer phone number
    target_username = identifier
    if not User.objects.filter(username=identifier).exists():
        # Try matching by phone in FarmerProfile
        profile = FarmerProfile.objects.filter(phone=identifier).first()
        if profile:
            target_username = profile.user.username

    user = authenticate(username=target_username, password=password)

    if not user:
        return Response({
            'message': 'Invalid phone number/username or password.',
        }, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({
            'message': 'Account is inactive.',
        }, status=status.HTTP_403_FORBIDDEN)

    token, _ = Token.objects.get_or_create(user=user)
    user_data = FarmerUserSerializer(user).data

    return Response({
        'message': 'Login successful',
        'token': token.key,
        'user': user_data
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def farmer_profile(request):
    """
    Retrieve or update profile of the currently logged-in farmer.
    """
    user = request.user
    
    # Ensure profile exists
    profile, _ = FarmerProfile.objects.get_or_create(
        user=user,
        defaults={'phone': user.username, 'location': 'Not specified', 'total_acres': 0.0}
    )

    if request.method == 'GET':
        return Response(FarmerUserSerializer(user).data)

    elif request.method == 'PUT':
        data = request.data
        if 'full_name' in data:
            name_parts = data['full_name'].strip().split(' ', 1)
            user.first_name = name_parts[0]
            user.last_name = name_parts[1] if len(name_parts) > 1 else ''
            user.save()

        if 'location' in data:
            profile.location = data['location'].strip()
        if 'total_acres' in data:
            profile.total_acres = data['total_acres']
        profile.save()

        return Response({
            'message': 'Profile updated successfully',
            'user': FarmerUserSerializer(user).data
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_farmer(request):
    """
    Invalidates the farmer's current authentication token.
    """
    try:
        # Delete the token associated with the user
        Token.objects.filter(user=request.user).delete()
    except Exception:
        pass
    
    return Response({
        'message': 'Successfully signed out'
    }, status=status.HTTP_200_OK)
