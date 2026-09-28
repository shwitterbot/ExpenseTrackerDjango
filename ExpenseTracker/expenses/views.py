from rest_framework import viewsets

from rest_framework.permissions import IsAuthenticated

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
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
