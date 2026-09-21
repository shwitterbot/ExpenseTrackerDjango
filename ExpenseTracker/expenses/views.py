from datetime import date
from decimal import Decimal

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.views import LoginView, LogoutView
from django.db.models import Sum
from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import TemplateView, CreateView, ListView
from rest_framework import viewsets

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from expenses.form import AddTransactionForm
from expenses.models import Transaction
from expenses.serializers import TransactionSerializer

CATEGORY_COLORS = {
    "🛒": "#ef6f6f", "🍽️": "#f39c4a", "🚗": "#5b8def", "🏠": "#e0567a",
    "💡": "#9b59b6", "📱": "#3498db", "🎮": "#a259e0", "🏥": "#e74c3c",
    "✈️": "#5b8def", "👕": "#f39c4a", "📚": "#16a085", "🎁": "#e91e63",
    "💼": "#1a7f5a", "💻": "#27ae60", "📈": "#2ecc71", "💰": "#16a085",
    "📁": "#94a3b8",
}

# Create your views here.
class DashboardView(LoginRequiredMixin, ListView):
    model = Transaction
    template_name = "expenses/dashboard.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        today = date.today()
        first_day = today.replace(day=1)

        qs = Transaction.objects.filter(
            user=self.request.user,
            date__gte=first_day,
            date__lte=today,
        )

        income = qs.filter(transaction_type="income").aggregate(s=Sum("amount"))["s"] or Decimal(0)
        expense = qs.filter(transaction_type="expense").aggregate(s=Sum("amount"))["s"] or Decimal(0)

        by_category = (
            qs.filter(transaction_type="expense")
            .values("category__title", "category__icon")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        total_expense = expense or Decimal(1)
        categories_data = [
            {
                "name": row["category__title"] or "Без категории",
                "icon": row["category__icon"] or "📁",
                "color": CATEGORY_COLORS.get(row["category__icon"], "#94a3b8"),
                "total": row["total"],
                "percent": round(row["total"] / total_expense * 100),
            }
            for row in by_category
        ]

        ctx.update({
            "title": "Кошелёк",
            "balance": income - expense,
            "income": income,
            "expense": expense,
            "categories_data": categories_data,
            "recent_transactions": qs.select_related("category").order_by("-date", "-created_at")[:10],
            "transactions_count": qs.count(),
            "transaction_form": AddTransactionForm(),
        })
        return ctx

class AddTransactionView(LoginRequiredMixin, CreateView):
    model = Transaction
    form_class = AddTransactionForm
    template_name = "expenses/_add_transaction.html"
    success_url = reverse_lazy("expenses:dashboard")

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context=super().get_context_data(**kwargs)
        context['transaction_form']=AddTransactionForm()
        return context


class AddCategoryView(LoginRequiredMixin, TemplateView):
    template_name = "expenses/_add_category.html"

class HomepageView(LoginView, TemplateView):
    template_name = "expenses/homepage.html"
    success_url = reverse_lazy('expenses:dashboard')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Homepage'
        context["login_form"] = AuthenticationForm()
        context["register_form"] = UserCreationForm()
        return context


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)