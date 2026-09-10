from django.test import TestCase
from django.urls import reverse
from rest_framework import status


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
