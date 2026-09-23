from django.contrib.auth.views import LogoutView, PasswordResetView
from django.contrib.messages import success
from django.template.defaulttags import url
from django.urls import path, reverse_lazy
# from .views import LoginUser, RegisterUser

app_name = "users"

urlpatterns = [
    # path("login/", LoginUser.as_view(), name="login"),
    # path("register/", RegisterUser.as_view(), name="register"),
    # path("logout/", LogoutView.as_view(), name="logout"),
    # path("reset-password/", PasswordResetView.as_view(
    #     template_name="users/password-reset.html",
    #     success_url=reverse_lazy("users/password-reset-done.html"),
    #     email_template_name="users/password-reset-email.html",
    # ), name="reset-password"),
]