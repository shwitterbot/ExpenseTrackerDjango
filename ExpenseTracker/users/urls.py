from django.contrib.auth.views import LogoutView, PasswordResetView
from django.contrib.messages import success
from django.template.defaulttags import url
from django.urls import path, reverse_lazy, include
from rest_framework import routers

from users.views import RegisterApi, UserViewSet

# from .views import LoginUser, RegisterUser

app_name = "users"
router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path("api-auth/", include('rest_framework.urls')),
    path("api-auth/register/", RegisterApi.as_view(), name='register'),
    path('api-auth/', include(router.urls)),
]