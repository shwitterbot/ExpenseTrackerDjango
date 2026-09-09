from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib.auth.views import LoginView, LogoutView
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import TemplateView, FormView, CreateView

from .form import UserLoginForm, UserRegisterForm


# Create your views here.
class RegisterUser(CreateView):
    model = User
    template_name = "users/register.html"
    success_url = reverse_lazy('expenses:dashboard')
    form_class = UserRegisterForm

class LoginUser(LoginView):
    template_name = "users/login.html"
    success_url = reverse_lazy('expenses:dashboard')
    form_class = UserLoginForm
