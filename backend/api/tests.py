from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import (
    FarmerProfile, Field, Crop, Expense, Harvest, Sale,
    FinancialAnalysis, CropRecommendation, YieldPrediction, ProfitPrediction
)


class ApiStatusTests(TestCase):
    def test_api_status_endpoint(self):
        """Verify the health check status endpoint responds with 200 OK and expected keys."""
        url = reverse('api-status')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data.get('status'), 'online')
        self.assertIn('team', data)
        self.assertEqual(data['team'].get('team_leader'), 'Sonali Bhauso Vidure')
        self.assertEqual(data['team'].get('team_member'), 'Shraddha Suresh Gurav')


class FarmerAuthTests(TestCase):
    def setUp(self):
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.profile_url = reverse('auth-profile')
        self.logout_url = reverse('auth-logout')

        self.valid_farmer_data = {
            'full_name': 'Sonali Vidure',
            'phone': '9876543210',
            'location': 'Kolhapur, Maharashtra',
            'total_acres': '4.5',
            'password': 'StrongPassword123',
            'confirm_password': 'StrongPassword123'
        }

    def test_successful_registration(self):
        response = self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.json())
        self.assertEqual(response.json()['user']['phone'], '9876543210')
        self.assertEqual(response.json()['user']['location'], 'Kolhapur, Maharashtra')
        self.assertTrue(FarmerProfile.objects.filter(phone='9876543210').exists())

    def test_duplicate_phone_registration_rejected(self):
        self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        duplicate_response = self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_password_mismatch_rejected(self):
        data = self.valid_farmer_data.copy()
        data['confirm_password'] = 'MismatchPass123'
        response = self.client.post(self.register_url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_phone(self):
        self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        login_response = self.client.post(self.login_url, {
            'username': '9876543210',
            'password': 'StrongPassword123'
        }, content_type='application/json')

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.json())
        self.assertEqual(login_response.json()['user']['phone'], '9876543210')

    def test_login_invalid_password(self):
        self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        login_response = self.client.post(self.login_url, {
            'username': '9876543210',
            'password': 'WrongPassword'
        }, content_type='application/json')

        self.assertEqual(login_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_retrieval_and_update(self):
        reg_response = self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        token = reg_response.json()['token']

        profile_response = self.client.get(
            self.profile_url, 
            HTTP_AUTHORIZATION=f'Token {token}'
        )
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.json()['phone'], '9876543210')

        update_response = self.client.put(
            self.profile_url,
            {'location': 'Sangli, Maharashtra', 'total_acres': '6.0'},
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Token {token}'
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.json()['user']['location'], 'Sangli, Maharashtra')

    def test_logout(self):
        reg_response = self.client.post(self.register_url, self.valid_farmer_data, content_type='application/json')
        token = reg_response.json()['token']

        logout_response = self.client.post(
            self.logout_url,
            HTTP_AUTHORIZATION=f'Token {token}'
        )
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(key=token).exists())


class DomainWorkflowTests(TestCase):
    """
    Comprehensive tests for Phases 3 through 8:
    Fields, Crops, Expenses, Harvests, Sales, Financials, Dashboard, and AI Modules.
    """
    def setUp(self):
        # Create test farmer user
        self.user = User.objects.create_user(username='9988776655', password='TestPassword123')
        self.profile = FarmerProfile.objects.create(
            user=self.user,
            phone='9988776655',
            location='Kolhapur',
            total_acres=5.0
        )
        self.token = Token.objects.create(user=self.user)
        self.auth_headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}

        # Create field
        self.field = Field.objects.create(
            farmer=self.user,
            field_name='Gat No. 12',
            land_area=2.5,
            soil_type='Black'
        )

        # Create crop
        self.crop = Crop.objects.create(
            farmer=self.user,
            field=self.field,
            crop_name='Sugarcane',
            variety='Co 86032',
            season='Kharif',
            sowing_date='2026-01-15',
            status='Growing'
        )

    def test_field_and_crop_crud(self):
        # 1. List fields
        res = self.client.get(reverse('field-list-create'), **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.json()), 1)

        # 2. Add new field
        res = self.client.post(
            reverse('field-list-create'),
            {'field_name': 'South Plot', 'land_area': '1.5', 'soil_type': 'Loamy'},
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # 3. List crops
        res = self.client.get(reverse('crop-list-create'), **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.json()), 1)

        # 4. Update crop status
        res = self.client.put(
            reverse('crop-detail', kwargs={'pk': self.crop.id}),
            {
                'crop_name': 'Sugarcane',
                'variety': 'Co 86032',
                'season': 'Kharif',
                'sowing_date': '2026-01-15',
                'field': self.field.id,
                'status': 'Harvested'
            },
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()['status'], 'Harvested')

    def test_expense_workflow(self):
        # Log expense
        exp_data = {
            'crop': self.crop.id,
            'expense_category': 'Fertilizers',
            'description': 'DAP and Urea for top dressing',
            'amount': '3500.00',
            'expense_date': '2026-02-10'
        }
        res = self.client.post(
            reverse('expense-list-create'),
            exp_data,
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(res.json()['amount']), 3500.00)

        # List expenses filtered by crop
        res = self.client.get(
            f"{reverse('expense-list-create')}?crop_id={self.crop.id}",
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.json()), 1)

    def test_harvest_and_sale_workflow(self):
        # Log harvest
        h_data = {
            'crop': self.crop.id,
            'harvest_date': '2026-08-20',
            'quantity_harvested': '250.00',
            'unit': 'Quintals'
        }
        res = self.client.post(
            reverse('harvest-list-create'),
            h_data,
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        harvest_id = res.json()['id']

        # Log sale
        s_data = {
            'harvest': harvest_id,
            'quantity_sold': '200.00',
            'selling_price': '320.00',
            'sale_date': '2026-08-25',
            'buyer_name': 'Kolhapur Sugar Factory APMC'
        }
        res = self.client.post(
            reverse('sale-list-create'),
            s_data,
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        # Verify generated total_amount: 200 * 320 = 64,000
        self.assertEqual(float(res.json()['total_amount']), 64000.00)

    def test_financial_recalculation_and_dashboard_summary(self):
        # 1. Add expense: 10,000
        Expense.objects.create(
            crop=self.crop,
            expense_category='Seeds',
            amount=10000.00,
            expense_date='2026-01-16'
        )

        # 2. Add harvest and sale: 50,000
        harvest = Harvest.objects.create(
            crop=self.crop,
            harvest_date='2026-08-20',
            quantity_harvested=100.00,
            unit='Quintals'
        )
        Sale.objects.create(
            harvest=harvest,
            quantity_sold=100.00,
            selling_price=500.00,
            total_amount=50000.00,
            sale_date='2026-08-25',
            buyer_name='Trader'
        )

        # 3. Trigger financial recalculation
        recalc_url = reverse('financial-crop', kwargs={'crop_id': self.crop.id})
        res = self.client.post(recalc_url, **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        analysis = res.json()['analysis']
        self.assertEqual(float(analysis['total_cost']), 10000.00)
        self.assertEqual(float(analysis['total_revenue']), 50000.00)
        self.assertEqual(float(analysis['profit_loss']), 40000.00)
        # Cost per acre: 10000 / 2.5 = 4000
        self.assertEqual(float(analysis['cost_per_acre']), 4000.00)

        # 4. Dashboard summary
        dash_url = reverse('dashboard-summary')
        res = self.client.get(dash_url, **self.auth_headers)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        summary = res.json()['summary']
        self.assertEqual(summary['total_crops'], 1)
        self.assertEqual(summary['total_expenses'], 10000.00)
        self.assertEqual(summary['total_revenue'], 50000.00)
        self.assertEqual(summary['net_profit'], 40000.00)

    def test_ai_modules(self):
        # 1. AI Crop Recommendation
        rec_data = {
            'soil_type': 'Black',
            'season': 'Kharif',
            'weather_conditions': 'Warm, moderate rainfall',
            'irrigation_type': 'Canal'
        }
        res = self.client.post(
            reverse('ai-crop-rec'),
            rec_data,
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('recommended_crop', res.json()['recommendation'])

        # 2. AI Yield Prediction
        yield_data = {
            'crop': self.crop.id,
            'land_area': '2.5',
            'season': 'Kharif',
            'soil_type': 'Black',
            'fertilizer_use': 'High (Urea + DAP)',
            'rainfall': '850.0'
        }
        res = self.client.post(
            reverse('ai-yield-pred'),
            yield_data,
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertGreater(float(res.json()['prediction']['predicted_yield']), 0)

        # 3. AI Profit Prediction
        profit_data = {
            'crop': self.crop.id,
            'estimated_cost': '15000.00',
            'predicted_yield': '50.00',
            'estimated_selling_price': '500.00'
        }
        res = self.client.post(
            reverse('ai-profit-pred'),
            profit_data,
            content_type='application/json',
            **self.auth_headers
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        # Expected profit: (50 * 500) - 15000 = 25000 - 15000 = 10000
        self.assertEqual(float(res.json()['prediction']['predicted_profit']), 10000.00)
