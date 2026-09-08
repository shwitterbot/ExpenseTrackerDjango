from django.shortcuts import render
from django.views import View
from django.views.generic import TemplateView


# Create your views here.
class DashboardView(TemplateView):
    template_name = "expenses/dashboard.html"


class AddTransactionView(TemplateView):
    template_name = "expenses/_add_transaction.html"


class AddCategoryView(TemplateView):
    template_name = "expenses/_add_category.html"

class HomepageView(TemplateView):
    template_name = "expenses/homepage.html"
