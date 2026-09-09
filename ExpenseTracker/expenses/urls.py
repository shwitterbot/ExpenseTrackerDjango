from django.contrib import admin
from django.urls import path, include

from . import views
from .views import DashboardView

app_name = 'expenses'

urlpatterns = [
    path("", views.HomepageView.as_view(), name="homepage"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("add_transaction/", views.AddTransactionView.as_view(), name="add_transaction"),
    path("add_category/", views.AddCategoryView.as_view(), name="add_category"),
]
