from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from .models import Category
from .views import TransactionViewSet


class TransactionTest(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username='testuser', password='1234567890')
        self.view = TransactionViewSet.as_view({'post': 'create'})
        self.category = Category.objects.create(title='test_category')

    def test_create_transaction(self):

        request = self.factory.post("api/v1/expenses/", data={
            'title': 'Test Transaction',
            'amount': 100,
            'type': 'expense',
            'category': self.category.id,
        }, format="json")

        force_authenticate(request, user=self.user)

        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)