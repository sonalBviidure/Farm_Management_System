from django.contrib import admin
from .models import (
    FarmerProfile,
    Field,
    Crop,
    Expense,
    Harvest,
    Sale,
    FinancialAnalysis,
    CropRecommendation,
    YieldPrediction,
    ProfitPrediction,
)


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'location', 'total_acres', 'created_at')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'phone', 'location')
    list_filter = ('location', 'created_at')


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('field_name', 'farmer', 'land_area', 'soil_type', 'created_at')
    search_fields = ('field_name', 'farmer__username', 'soil_type')
    list_filter = ('soil_type', 'created_at')


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('crop_name', 'variety', 'season', 'status', 'field', 'farmer', 'sowing_date')
    search_fields = ('crop_name', 'variety', 'farmer__username')
    list_filter = ('season', 'status', 'sowing_date')


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('crop', 'expense_category', 'amount', 'expense_date', 'description')
    search_fields = ('crop__crop_name', 'expense_category', 'description')
    list_filter = ('expense_category', 'expense_date')


@admin.register(Harvest)
class HarvestAdmin(admin.ModelAdmin):
    list_display = ('crop', 'quantity_harvested', 'unit', 'harvest_date')
    search_fields = ('crop__crop_name', 'unit')
    list_filter = ('harvest_date', 'unit')


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('harvest', 'quantity_sold', 'selling_price', 'total_amount', 'buyer_name', 'sale_date')
    search_fields = ('harvest__crop__crop_name', 'buyer_name')
    list_filter = ('sale_date',)


@admin.register(FinancialAnalysis)
class FinancialAnalysisAdmin(admin.ModelAdmin):
    list_display = ('crop', 'total_revenue', 'total_cost', 'profit_loss', 'cost_per_acre', 'profit_per_acre', 'calculated_at')
    search_fields = ('crop__crop_name',)


@admin.register(CropRecommendation)
class CropRecommendationAdmin(admin.ModelAdmin):
    list_display = ('recommended_crop', 'farmer', 'soil_type', 'season', 'irrigation_type', 'recommendation_date')
    search_fields = ('recommended_crop', 'farmer__username')
    list_filter = ('season', 'soil_type')


@admin.register(YieldPrediction)
class YieldPredictionAdmin(admin.ModelAdmin):
    list_display = ('crop', 'predicted_yield', 'land_area', 'season', 'soil_type', 'prediction_date')
    search_fields = ('crop__crop_name',)
    list_filter = ('season', 'soil_type')


@admin.register(ProfitPrediction)
class ProfitPredictionAdmin(admin.ModelAdmin):
    list_display = ('crop', 'predicted_yield', 'estimated_cost', 'estimated_selling_price', 'predicted_profit', 'prediction_date')
    search_fields = ('crop__crop_name',)
