from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import FarmerProfile


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

        # GET profile authenticated
        profile_response = self.client.get(
            self.profile_url, 
            HTTP_AUTHORIZATION=f'Token {token}'
        )
        self.assertEqual(profile_response.status_code, status.HTTP_200_OK)
        self.assertEqual(profile_response.json()['phone'], '9876543210')

        # PUT profile update
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
        # Token should now be removed
        self.assertFalse(Token.objects.filter(key=token).exists())
