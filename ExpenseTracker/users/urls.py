from django.template.defaulttags import url
from django.urls import path
from .views import LoginView, RegisterView

app_name = "users"

urlpatterns = [
    path("users/login/", LoginView.as_view(), name="login"),
    path("users/register/", RegisterView.as_view(), name="register")
]