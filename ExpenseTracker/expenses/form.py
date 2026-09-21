from django import forms

from expenses.models import Transaction


class AddTransactionForm(forms.ModelForm):
    class Meta:
        model = Transaction
        fields = ['type', 'title', 'amount', 'category']
        widgets = {
            "type": forms.RadioSelect(attrs={"class": "type-radio"}),
            "date": forms.DateInput(attrs={"type": "date"}),
            "amount": forms.NumberInput(attrs={"step": "0.01", "min": "0", "placeholder": "0"}),
            "title": forms.TextInput(attrs={"placeholder": "Например: Пятёрочка"}),
            "category": forms.RadioSelect(attrs={"class": "cat-radio"}),
        }