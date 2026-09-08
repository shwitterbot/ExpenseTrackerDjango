from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import render
from django.views.generic import TemplateView, FormView

from .form import UserLoginForm


# Create your views here.
class RegisterView(FormView):
    model = User
    template_name = "users/register.html"
    success_url = '/dashboard/'
    form_class = UserCreationForm

class LoginView(FormView):
    template_name = "users/login.html"
    success_url = '/dashboard/'
    form_class = UserLoginForm