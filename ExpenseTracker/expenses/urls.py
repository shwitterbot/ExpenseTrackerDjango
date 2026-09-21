from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from .views import DashboardView

app_name = 'expenses'

router = DefaultRouter()
router.register(r"transactions", views.TransactionViewSet, basename="transactions")

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("", views.HomepageView.as_view(), name="homepage"),
    # path("dashboard/", DashboardView.as_view(), name="dashboard"),
    # path("add_transaction/", views.AddTransactionView.as_view(), name="add_transaction"),
    # path("add_category/", views.AddCategoryView.as_view(), name="add_category"),
]
