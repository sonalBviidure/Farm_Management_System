from django.urls import path
from .views import (
    # Phase 2 — Auth (Sonali)
    api_status,
    register_farmer,
    login_farmer,
    farmer_profile,
    logout_farmer,

    # Phase 3 — Fields & Crops (Shraddha)
    field_list_create,
    field_detail,
    crop_list_create,
    crop_detail,

    # Phase 4 — Expenses (Shraddha)
    expense_list_create,
    expense_detail,

    # Phase 5 — Harvest & Sales (Shraddha)
    harvest_list_create,
    harvest_detail,
    sale_list_create,
    sale_detail,

    # Phase 6 — Financial Analysis (Sonali)
    financial_analysis_list,
    financial_analysis_for_crop,

    # Phase 7 — Reports / Dashboard (Sonali)
    dashboard_summary,
    crop_comparison_report,

    # Phase 8 — AI Modules
    crop_recommendation,    # 8b Sonali
    yield_prediction,       # 8a Shraddha
    profit_prediction,      # 8c Sonali
)

urlpatterns = [
    # ── Health Check ──────────────────────────────────────────────
    path('status/', api_status, name='api-status'),

    # ── Auth (Phase 2 — Sonali) ───────────────────────────────────
    path('auth/register/', register_farmer, name='auth-register'),
    path('auth/login/', login_farmer, name='auth-login'),
    path('auth/profile/', farmer_profile, name='auth-profile'),
    path('auth/logout/', logout_farmer, name='auth-logout'),

    # ── Fields (Phase 3 — Shraddha) ───────────────────────────────
    path('fields/', field_list_create, name='field-list-create'),
    path('fields/<int:pk>/', field_detail, name='field-detail'),

    # ── Crops (Phase 3 — Shraddha) ────────────────────────────────
    path('crops/', crop_list_create, name='crop-list-create'),
    path('crops/<int:pk>/', crop_detail, name='crop-detail'),

    # ── Expenses (Phase 4 — Shraddha) ─────────────────────────────
    path('expenses/', expense_list_create, name='expense-list-create'),
    path('expenses/<int:pk>/', expense_detail, name='expense-detail'),

    # ── Harvests (Phase 5 — Shraddha) ─────────────────────────────
    path('harvests/', harvest_list_create, name='harvest-list-create'),
    path('harvests/<int:pk>/', harvest_detail, name='harvest-detail'),

    # ── Sales (Phase 5 — Shraddha) ────────────────────────────────
    path('sales/', sale_list_create, name='sale-list-create'),
    path('sales/<int:pk>/', sale_detail, name='sale-detail'),

    # ── Financial Analysis (Phase 6 — Sonali) ─────────────────────
    path('financial/', financial_analysis_list, name='financial-list'),
    path('financial/crop/<int:crop_id>/', financial_analysis_for_crop, name='financial-crop'),

    # ── Reports / Dashboard (Phase 7 — Sonali) ────────────────────
    path('reports/dashboard/', dashboard_summary, name='dashboard-summary'),
    path('reports/crop-comparison/', crop_comparison_report, name='crop-comparison'),

    # ── AI Modules (Phase 8) ──────────────────────────────────────
    path('ai/crop-recommendation/', crop_recommendation, name='ai-crop-rec'),    # Sonali
    path('ai/yield-prediction/', yield_prediction, name='ai-yield-pred'),         # Shraddha
    path('ai/profit-prediction/', profit_prediction, name='ai-profit-pred'),      # Sonali
]
