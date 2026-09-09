from django.contrib.auth.views import LogoutView
from django.template.defaulttags import url
from django.urls import path
from .views import LoginUser, RegisterUser, LogoutUser

app_name = "users"

urlpatterns = [
    path("login/", LoginUser.as_view(), name="login"),
    path("register/", RegisterUser.as_view(), name="register"),
    path("logout/", LogoutUser.as_view(), name="logout"),
]