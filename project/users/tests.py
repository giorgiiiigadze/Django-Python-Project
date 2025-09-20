from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
User = get_user_model()

# python manage.py test

class AuthTests(APITestCase):
    def setUp(self):
        # davtesto endpointebi
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.user_data = {
            "username": "testuser",
            "email":"ramme@gmail.com",
            "phone_number": "1234567890",
            "first_name" : "testname",
            "last_name" : "testlastname",
            "password" : "Password0@1",
            "confirm_password" : "Password0@1"
        }
    

    def test_RegisterView(self):
        # status codes, databaseshi rogor inaxavs
        response = self.client.post(self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    
    def test_login_user(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_data = {
            "username":"testuser",
            "password": "Password0@1"
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_logout_user(self):
        self.client.post(self.register_url, self.user_data, format='json')
        login_data = {
            "username":"testuser",
            "password": "Password0@1"
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['refresh']

        response = self.client.post(self.logout_url, {"refresh": refresh_token}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], "Successfully logged out.")



