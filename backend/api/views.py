"""
FMS API Views — Farm Management System
---------------------------------------
Phase 2  (Auth)           — Sonali Bhauso Vidure
Phase 6  (Financial)      — Sonali Bhauso Vidure
Phase 7  (Reports)        — Sonali Bhauso Vidure
Phase 8b (AI Crop Rec)    — Sonali Bhauso Vidure
Phase 8c (AI Profit Pred) — Sonali Bhauso Vidure

Phase 3  (Crops)          — Shraddha Suresh Gurav
Phase 4  (Expenses)       — Shraddha Suresh Gurav
Phase 5  (Harvest/Sales)  — Shraddha Suresh Gurav
Phase 8a (AI Yield Pred)  — Shraddha Suresh Gurav
"""

import os
from decimal import Decimal
import joblib
import pandas as pd
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum, Count, Q

# Load trained Scikit-Learn pipelines
ML_MODELS_DIR = os.path.join(settings.BASE_DIR, 'ml_models', 'saved_models')
try:
    CROP_REC_MODEL = joblib.load(os.path.join(ML_MODELS_DIR, 'crop_recommendation_model.pkl'))
except Exception:
    CROP_REC_MODEL = None

try:
    YIELD_PRED_MODEL = joblib.load(os.path.join(ML_MODELS_DIR, 'yield_prediction_model.pkl'))
except Exception:
    YIELD_PRED_MODEL = None

try:
    PROFIT_PRED_MODEL = joblib.load(os.path.join(ML_MODELS_DIR, 'profit_prediction_model.pkl'))
except Exception:
    PROFIT_PRED_MODEL = None


from .models import (
    FarmerProfile, Field, Crop, Expense, Harvest, Sale,
    FinancialAnalysis, CropRecommendation, YieldPrediction, ProfitPrediction
)
from .serializers import (
    UserRegistrationSerializer,
    FarmerUserSerializer,
    LoginSerializer,
    FieldSerializer,
    CropSerializer,
    ExpenseSerializer,
    HarvestSerializer,
    SaleSerializer,
    FinancialAnalysisSerializer,
    CropRecommendationSerializer,
    YieldPredictionSerializer,
    ProfitPredictionSerializer,
)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 2 — AUTH VIEWS  (Sonali)
# ═══════════════════════════════════════════════════════════════════

@api_view(['GET'])
@permission_classes([AllowAny])
def api_status(request):
    """Health check and module status endpoint."""
    db_engine = settings.DATABASES['default']['ENGINE'].split('.')[-1]

    return Response({
        'status': 'online',
        'project': 'Farm Management System (FMS)',
        'version': '3.0.0 (Phase 3-8 Modules Active)',
        'team': {
            'team_leader': 'Sonali Bhauso Vidure',
            'team_member': 'Shraddha Suresh Gurav'
        },
        'database': {
            'engine': db_engine,
            'configured_for_mysql': settings.USE_MYSQL,
        },
        'server_time': timezone.now().isoformat(),
        'message': 'FMS Backend API — All modules operational.'
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_farmer(request):
    """Register a new farmer account with agricultural profile details."""
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
    """Authenticate a farmer using phone number (or username) and password."""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'message': 'Invalid input',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    identifier = serializer.validated_data['username'].strip()
    password = serializer.validated_data['password']

    target_username = identifier
    if not User.objects.filter(username=identifier).exists():
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
    """Retrieve or update profile of the currently logged-in farmer."""
    user = request.user
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
    """Invalidates the farmer's current authentication token."""
    try:
        Token.objects.filter(user=request.user).delete()
    except Exception:
        pass
    return Response({'message': 'Successfully signed out'}, status=status.HTTP_200_OK)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 3 — FIELD & CROP VIEWS  (Shraddha)
# ═══════════════════════════════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def field_list_create(request):
    """List all fields or create a new field for the logged-in farmer."""
    if request.method == 'GET':
        fields = Field.objects.filter(farmer=request.user).order_by('field_name')
        serializer = FieldSerializer(fields, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FieldSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(farmer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def field_detail(request, pk):
    """Retrieve, update or delete a specific field."""
    try:
        field = Field.objects.get(pk=pk, farmer=request.user)
    except Field.DoesNotExist:
        return Response({'error': 'Field not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(FieldSerializer(field).data)

    elif request.method == 'PUT':
        serializer = FieldSerializer(field, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        field.delete()
        return Response({'message': 'Field deleted.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def crop_list_create(request):
    """List all crops or create a new crop for the logged-in farmer."""
    if request.method == 'GET':
        crops = Crop.objects.filter(farmer=request.user).select_related('field').order_by('-sowing_date')
        serializer = CropSerializer(crops, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CropSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(farmer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def crop_detail(request, pk):
    """Retrieve, update or delete a specific crop."""
    try:
        crop = Crop.objects.get(pk=pk, farmer=request.user)
    except Crop.DoesNotExist:
        return Response({'error': 'Crop not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(CropSerializer(crop).data)

    elif request.method == 'PUT':
        serializer = CropSerializer(crop, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        crop.delete()
        return Response({'message': 'Crop deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 4 — EXPENSE VIEWS  (Shraddha)
# ═══════════════════════════════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def expense_list_create(request):
    """List all expenses for farmer's crops or create a new expense."""
    if request.method == 'GET':
        crop_id = request.query_params.get('crop_id')
        expenses = Expense.objects.filter(crop__farmer=request.user)
        if crop_id:
            expenses = expenses.filter(crop_id=crop_id)
        expenses = expenses.order_by('-expense_date')
        serializer = ExpenseSerializer(expenses, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def expense_detail(request, pk):
    """Retrieve, update or delete a specific expense."""
    try:
        expense = Expense.objects.get(pk=pk, crop__farmer=request.user)
    except Expense.DoesNotExist:
        return Response({'error': 'Expense not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(ExpenseSerializer(expense).data)

    elif request.method == 'PUT':
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        expense.delete()
        return Response({'message': 'Expense deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 5 — HARVEST & SALE VIEWS  (Shraddha)
# ═══════════════════════════════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def harvest_list_create(request):
    """List all harvests or create a new harvest record."""
    if request.method == 'GET':
        crop_id = request.query_params.get('crop_id')
        harvests = Harvest.objects.filter(crop__farmer=request.user).prefetch_related('sales')
        if crop_id:
            harvests = harvests.filter(crop_id=crop_id)
        harvests = harvests.order_by('-harvest_date')
        serializer = HarvestSerializer(harvests, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = HarvestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def harvest_detail(request, pk):
    """Retrieve, update or delete a specific harvest."""
    try:
        harvest = Harvest.objects.get(pk=pk, crop__farmer=request.user)
    except Harvest.DoesNotExist:
        return Response({'error': 'Harvest not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(HarvestSerializer(harvest).data)

    elif request.method == 'PUT':
        serializer = HarvestSerializer(harvest, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        harvest.delete()
        return Response({'message': 'Harvest deleted.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sale_list_create(request):
    """List all sales or create a new sale record."""
    if request.method == 'GET':
        harvest_id = request.query_params.get('harvest_id')
        sales = Sale.objects.filter(harvest__crop__farmer=request.user)
        if harvest_id:
            sales = sales.filter(harvest_id=harvest_id)
        sales = sales.order_by('-sale_date')
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def sale_detail(request, pk):
    """Retrieve, update or delete a specific sale."""
    try:
        sale = Sale.objects.get(pk=pk, harvest__crop__farmer=request.user)
    except Sale.DoesNotExist:
        return Response({'error': 'Sale not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(SaleSerializer(sale).data)

    elif request.method == 'PUT':
        serializer = SaleSerializer(sale, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        sale.delete()
        return Response({'message': 'Sale deleted.'}, status=status.HTTP_204_NO_CONTENT)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 6 — FINANCIAL ANALYSIS VIEWS  (Sonali)
# ═══════════════════════════════════════════════════════════════════

def _recalculate_financial_analysis(crop):
    """
    Core calculation engine for a crop cycle's financial metrics.
    Called whenever expenses or sales are modified.
    """
    # Total cost = sum of all expense amounts for this crop
    total_cost = Expense.objects.filter(crop=crop).aggregate(
        total=Sum('amount')
    )['total'] or Decimal('0.00')

    # Total revenue = sum of all sale total_amounts for harvests of this crop
    total_revenue = Sale.objects.filter(harvest__crop=crop).aggregate(
        total=Sum('total_amount')
    )['total'] or Decimal('0.00')

    profit_loss = total_revenue - total_cost

    # Land area from the crop's field
    land_area = crop.field.land_area if crop.field.land_area else Decimal('1')
    cost_per_acre = round(total_cost / land_area, 2)
    profit_per_acre = round(profit_loss / land_area, 2)

    analysis, _ = FinancialAnalysis.objects.update_or_create(
        crop=crop,
        defaults={
            'total_cost': total_cost,
            'total_revenue': total_revenue,
            'profit_loss': profit_loss,
            'cost_per_acre': cost_per_acre,
            'profit_per_acre': profit_per_acre,
        }
    )
    return analysis


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_analysis_list(request):
    """
    List financial analysis summaries for all crops of the logged-in farmer.
    Optionally filter by crop_id.
    """
    crop_id = request.query_params.get('crop_id')
    analyses = FinancialAnalysis.objects.filter(
        crop__farmer=request.user
    ).select_related('crop')
    if crop_id:
        analyses = analyses.filter(crop_id=crop_id)

    serializer = FinancialAnalysisSerializer(analyses, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def financial_analysis_for_crop(request, crop_id):
    """
    GET  — Retrieve existing financial analysis for a crop.
    POST — Trigger recalculation (recalculate from current expenses + sales).
    """
    try:
        crop = Crop.objects.get(pk=crop_id, farmer=request.user)
    except Crop.DoesNotExist:
        return Response({'error': 'Crop not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        try:
            analysis = FinancialAnalysis.objects.get(crop=crop)
            return Response(FinancialAnalysisSerializer(analysis).data)
        except FinancialAnalysis.DoesNotExist:
            return Response(
                {'message': 'No financial analysis yet. POST to /recalculate/ to generate.'},
                status=status.HTTP_404_NOT_FOUND
            )

    elif request.method == 'POST':
        analysis = _recalculate_financial_analysis(crop)
        return Response({
            'message': 'Financial analysis recalculated successfully.',
            'analysis': FinancialAnalysisSerializer(analysis).data
        })


# ═══════════════════════════════════════════════════════════════════
#  PHASE 7 — REPORTS & DASHBOARD VIEWS  (Sonali)
# ═══════════════════════════════════════════════════════════════════

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """
    Central dashboard API — returns all KPI metrics for the farmer dashboard.
    Includes: crop counts, total expenses, revenue, profit/loss, and per-season breakdown.
    """
    farmer = request.user

    # Basic counts
    total_crops = Crop.objects.filter(farmer=farmer).count()
    active_crops = Crop.objects.filter(farmer=farmer, status__in=['Sown', 'Growing']).count()
    total_fields = Field.objects.filter(farmer=farmer).count()

    # Expense & revenue aggregates
    total_expenses_agg = Expense.objects.filter(
        crop__farmer=farmer
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

    total_revenue_agg = Sale.objects.filter(
        harvest__crop__farmer=farmer
    ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')

    net_profit = total_revenue_agg - total_expenses_agg

    # Recent crops (last 5)
    recent_crops = Crop.objects.filter(farmer=farmer).select_related('field').order_by('-sowing_date')[:5]
    recent_crops_data = [
        {
            'id': c.id,
            'crop_name': c.crop_name,
            'season': c.season,
            'status': c.status,
            'field_name': c.field.field_name,
            'sowing_date': c.sowing_date,
        }
        for c in recent_crops
    ]

    # Season-wise expense breakdown
    season_breakdown = []
    for season_code, season_label in Crop.SEASON_CHOICES:
        season_expense = Expense.objects.filter(
            crop__farmer=farmer,
            crop__season=season_code
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        season_revenue = Sale.objects.filter(
            harvest__crop__farmer=farmer,
            harvest__crop__season=season_code
        ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')

        season_breakdown.append({
            'season': season_label,
            'total_expense': float(season_expense),
            'total_revenue': float(season_revenue),
            'profit_loss': float(season_revenue - season_expense),
        })

    # Expense category breakdown
    category_breakdown = []
    for cat_code, cat_label in Expense.CATEGORY_CHOICES:
        cat_total = Expense.objects.filter(
            crop__farmer=farmer,
            expense_category=cat_code
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        if cat_total > 0:
            category_breakdown.append({
                'category': cat_label,
                'total': float(cat_total)
            })

    return Response({
        'summary': {
            'total_crops': total_crops,
            'active_crops': active_crops,
            'total_fields': total_fields,
            'total_expenses': float(total_expenses_agg),
            'total_revenue': float(total_revenue_agg),
            'net_profit': float(net_profit),
        },
        'recent_crops': recent_crops_data,
        'season_breakdown': season_breakdown,
        'expense_by_category': category_breakdown,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def crop_comparison_report(request):
    """
    Compare all crop cycles financially — useful for Charts / Reports page.
    Returns per-crop: name, season, cost, revenue, profit/loss.
    """
    farmer = request.user
    analyses = FinancialAnalysis.objects.filter(
        crop__farmer=farmer
    ).select_related('crop', 'crop__field').order_by('-crop__sowing_date')

    report = []
    for a in analyses:
        report.append({
            'crop_id': a.crop.id,
            'crop_name': a.crop.crop_name,
            'variety': a.crop.variety,
            'season': a.crop.season,
            'field_name': a.crop.field.field_name,
            'land_area': float(a.crop.field.land_area),
            'total_cost': float(a.total_cost),
            'total_revenue': float(a.total_revenue),
            'profit_loss': float(a.profit_loss),
            'cost_per_acre': float(a.cost_per_acre),
            'profit_per_acre': float(a.profit_per_acre),
        })

    return Response({'crop_comparison': report})


# ═══════════════════════════════════════════════════════════════════
#  PHASE 8b — AI CROP RECOMMENDATION  (Sonali)
# ═══════════════════════════════════════════════════════════════════

# Simple rule-based AI logic (Phase 8 placeholder for ML model integration)
CROP_RECOMMENDATION_RULES = [
    # (soil, season, weather_keyword, irrigation, recommended_crop)
    ('Black',    'Kharif',  'rain',   'Rainfed',  'Cotton'),
    ('Black',    'Rabi',    'cool',   'Canal',    'Wheat'),
    ('Red',      'Kharif',  'rain',   'Rainfed',  'Groundnut'),
    ('Red',      'Rabi',    'dry',    'Drip',     'Sunflower'),
    ('Loamy',    'Kharif',  'rain',   'Rainfed',  'Soybean'),
    ('Loamy',    'Rabi',    'cool',   'Canal',    'Wheat'),
    ('Alluvial', 'Kharif',  'humid',  'Canal',    'Rice'),
    ('Alluvial', 'Rabi',    'cool',   'Canal',    'Sugarcane'),
    ('Clayey',   'Kharif',  'rain',   'Rainfed',  'Rice'),
    ('Sandy',    'Zaid',    'hot',    'Drip',     'Watermelon'),
]


def _ai_recommend_crop(soil_type, season, weather_conditions, irrigation_type):
    """
    Trained Scikit-Learn RandomForestClassifier inference with fallback.
    """
    if CROP_REC_MODEL is not None:
        try:
            df = pd.DataFrame([{
                'soil_type': soil_type,
                'season': season,
                'irrigation_type': irrigation_type
            }])
            pred = CROP_REC_MODEL.predict(df)
            if len(pred) > 0 and pred[0]:
                return str(pred[0])
        except Exception:
            pass

    weather_lower = weather_conditions.lower()
    # Try to find an exact or partial match
    for rule in CROP_RECOMMENDATION_RULES:
        r_soil, r_season, r_weather_kw, r_irrigation, r_crop = rule
        if (r_soil.lower() == soil_type.lower() and
                r_season.lower() == season.lower() and
                r_weather_kw in weather_lower):
            return r_crop

    # Fallback by soil + season only
    for rule in CROP_RECOMMENDATION_RULES:
        r_soil, r_season, _, _, r_crop = rule
        if r_soil.lower() == soil_type.lower() and r_season.lower() == season.lower():
            return r_crop

    # Default fallback
    season_defaults = {
        'Kharif': 'Soybean',
        'Rabi': 'Wheat',
        'Zaid': 'Maize',
        'Annual': 'Sugarcane',
    }
    return season_defaults.get(season, 'Soybean')



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def crop_recommendation(request):
    """
    POST — Submit soil/weather parameters and receive an AI crop recommendation.
    GET  — List all past recommendations for the farmer.
    """
    if request.method == 'GET':
        recs = CropRecommendation.objects.filter(farmer=request.user).order_by('-recommendation_date')
        serializer = CropRecommendationSerializer(recs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CropRecommendationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        soil_type = serializer.validated_data['soil_type']
        season = serializer.validated_data['season']
        weather_conditions = serializer.validated_data['weather_conditions']
        irrigation_type = serializer.validated_data['irrigation_type']

        recommended = _ai_recommend_crop(soil_type, season, weather_conditions, irrigation_type)

        rec = CropRecommendation.objects.create(
            farmer=request.user,
            soil_type=soil_type,
            season=season,
            weather_conditions=weather_conditions,
            irrigation_type=irrigation_type,
            recommended_crop=recommended,
        )

        return Response({
            'message': 'Crop recommendation generated successfully.',
            'recommendation': CropRecommendationSerializer(rec).data
        }, status=status.HTTP_201_CREATED)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 8a — AI YIELD PREDICTION  (Shraddha)
# ═══════════════════════════════════════════════════════════════════

# Yield base values per crop (quintals per acre)
YIELD_BASE = {
    'wheat':      18.0,
    'rice':       22.0,
    'soybean':    12.0,
    'cotton':     8.0,
    'sugarcane':  350.0,
    'groundnut':  10.0,
    'maize':      20.0,
    'sunflower':  9.0,
    'watermelon': 60.0,
}


def _ai_predict_yield(crop_name, land_area, season, soil_type, fertilizer_use, rainfall):
    """
    Trained Scikit-Learn GradientBoostingRegressor inference with domain fallback.
    """
    if YIELD_PRED_MODEL is not None:
        try:
            df = pd.DataFrame([{
                'crop_name': crop_name,
                'soil_type': soil_type,
                'season': season,
                'fertilizer_use': fertilizer_use or 'Standard Balanced',
                'land_area': float(land_area),
                'rainfall': float(rainfall) if rainfall is not None else 650.0
            }])
            pred = YIELD_PRED_MODEL.predict(df)
            if len(pred) > 0 and pred[0] > 0:
                return round(float(pred[0]), 2)
        except Exception:
            pass

    base = YIELD_BASE.get(crop_name.lower(), 15.0)

    soil_factors = {'Black': 1.10, 'Alluvial': 1.15, 'Loamy': 1.05, 'Red': 0.95, 'Clayey': 1.0, 'Sandy': 0.85}
    soil_factor = soil_factors.get(soil_type, 1.0)

    fertilizer_factor = 1.0
    if fertilizer_use:
        fu = fertilizer_use.lower()
        if 'high' in fu or 'urea' in fu or 'dap' in fu:
            fertilizer_factor = 1.20
        elif 'medium' in fu or 'npk' in fu:
            fertilizer_factor = 1.10
        elif 'low' in fu or 'none' in fu or 'organic' in fu:
            fertilizer_factor = 0.90

    rainfall_factor = 1.0
    if rainfall is not None:
        rain_mm = float(rainfall)
        if rain_mm >= 800:
            rainfall_factor = 1.10
        elif rain_mm >= 500:
            rainfall_factor = 1.05
        elif rain_mm < 300:
            rainfall_factor = 0.85

    predicted = round(base * float(land_area) * soil_factor * fertilizer_factor * rainfall_factor, 2)
    return predicted


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def yield_prediction(request):
    """
    POST — Submit crop parameters and receive a predicted yield.
    GET  — List all past yield predictions for farmer's crops.
    """
    if request.method == 'GET':
        predictions = YieldPrediction.objects.filter(
            crop__farmer=request.user
        ).select_related('crop').order_by('-prediction_date')
        serializer = YieldPredictionSerializer(predictions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = YieldPredictionSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        crop = serializer.validated_data['crop']

        # Verify ownership
        if crop.farmer != request.user:
            return Response({'error': 'You do not own this crop.'}, status=status.HTTP_403_FORBIDDEN)

        land_area = serializer.validated_data['land_area']
        season = serializer.validated_data['season']
        soil_type = serializer.validated_data['soil_type']
        fertilizer_use = serializer.validated_data.get('fertilizer_use', '')
        rainfall = serializer.validated_data.get('rainfall', None)

        predicted = _ai_predict_yield(
            crop.crop_name, land_area, season, soil_type, fertilizer_use, rainfall
        )

        prediction = YieldPrediction.objects.create(
            crop=crop,
            land_area=land_area,
            season=season,
            soil_type=soil_type,
            fertilizer_use=fertilizer_use,
            rainfall=rainfall,
            predicted_yield=predicted,
        )

        return Response({
            'message': 'Yield prediction calculated successfully.',
            'prediction': YieldPredictionSerializer(prediction).data
        }, status=status.HTTP_201_CREATED)


# ═══════════════════════════════════════════════════════════════════
#  PHASE 8c — AI PROFIT PREDICTION  (Sonali)
# ═══════════════════════════════════════════════════════════════════

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def profit_prediction(request):
    """
    POST — Submit cost/yield/price estimates and receive predicted profit.
    GET  — List all past profit predictions for farmer's crops.
    """
    if request.method == 'GET':
        predictions = ProfitPrediction.objects.filter(
            crop__farmer=request.user
        ).select_related('crop').order_by('-prediction_date')
        serializer = ProfitPredictionSerializer(predictions, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ProfitPredictionSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        crop = serializer.validated_data['crop']
        if crop.farmer != request.user:
            return Response({'error': 'You do not own this crop.'}, status=status.HTTP_403_FORBIDDEN)

        estimated_cost = serializer.validated_data['estimated_cost']
        predicted_yield = serializer.validated_data['predicted_yield']
        estimated_selling_price = serializer.validated_data['estimated_selling_price']

        # Exact accounting profit definition: (yield × price) − cost
        predicted_profit = round(
            (float(predicted_yield) * float(estimated_selling_price)) - float(estimated_cost), 2
        )

        # Machine Learning model evaluation
        ml_prediction = None
        if PROFIT_PRED_MODEL is not None:
            try:
                df = pd.DataFrame([{
                    'crop_name': crop.crop_name,
                    'estimated_cost': float(estimated_cost),
                    'predicted_yield': float(predicted_yield),
                    'estimated_selling_price': float(estimated_selling_price),
                }])
                ml_pred = PROFIT_PRED_MODEL.predict(df)
                if len(ml_pred) > 0:
                    ml_prediction = round(float(ml_pred[0]), 2)
            except Exception:
                pass

        prediction = ProfitPrediction.objects.create(
            crop=crop,
            estimated_cost=estimated_cost,
            predicted_yield=predicted_yield,
            estimated_selling_price=estimated_selling_price,
            predicted_profit=predicted_profit,
        )

        resp_data = ProfitPredictionSerializer(prediction).data
        if ml_prediction is not None:
            resp_data['ml_predicted_profit'] = ml_prediction

        return Response({
            'message': 'Profit prediction calculated successfully.',
            'prediction': resp_data
        }, status=status.HTTP_201_CREATED)


