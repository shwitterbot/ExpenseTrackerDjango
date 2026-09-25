from django.contrib.auth.models import User
from django.test import TestCase

# Create your tests here.
class AuthTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test_name',
            email='testemail@test.com',
            password='test_password'
        )

    def test_create_user(self):
        self.assertEqual(self.user.username, 'test_name')
        self.assertEqual(self.user.email, 'testemail@test.com')
        self.assertTrue(self.user.check_password('test_password'))