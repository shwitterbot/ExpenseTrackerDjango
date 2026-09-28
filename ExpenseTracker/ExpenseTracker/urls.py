from django.contrib import admin
from django.urls import path, include

from users.views import RegisterApi

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include('expenses.urls')),
    path("users/", include('users.urls')),
]
