from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from expenses.models import Transaction


class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'title', 'amount', 'type', 'category', 'date']
        read_only_fields = ['id', 'date']
