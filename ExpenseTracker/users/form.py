from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django import forms
from django.views.generic import FormView


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(max_length=20, label="Имя пользователя", widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = forms.CharField(max_length=20, label="Пароль", widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))

class UserRegisterForm(UserCreationForm):
    username = forms.CharField(max_length=20, label="Username", widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password1 = forms.CharField(max_length=20, label="Password", widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))
    password2 = forms.CharField(max_length=20, label="Password confirmation", widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password confirmation'}))