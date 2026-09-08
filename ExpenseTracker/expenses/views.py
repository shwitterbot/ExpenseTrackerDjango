from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView


# Create your views here.
class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "expenses/dashboard.html"

class AddTransactionView(LoginRequiredMixin, TemplateView):
    template_name = "expenses/_add_transaction.html"

class AddCategoryView(LoginRequiredMixin, TemplateView):
    template_name = "expenses/_add_category.html"

class HomepageView(TemplateView):
    template_name = "expenses/homepage.html"
