from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'expenses'

router = DefaultRouter()
router.register(r"transactions", views.TransactionViewSet, basename="transactions")

urlpatterns = [
    path("api/v1/", include(router.urls)),
]
