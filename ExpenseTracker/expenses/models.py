from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Transaction(models.Model):
    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'


    class TransactionType(models.TextChoices):
        INCOME = 'income', 'Доход'
        EXPENSE = 'expense', 'Расход'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    title = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=TransactionType.choices, default=TransactionType.EXPENSE)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, related_name="transactions", null=True)
    date = models.DateField(verbose_name='Дата', auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.description

class Category(models.Model):
    class Icon(models.TextChoices):
        SHOPPING = '🛒', 'Продукты'
        RESTAURANT = '🍽️', 'Кафе и рестораны'
        CAR = '🚗', 'Транспорт'
        BUS = '🚌', 'Автобус'
        SUBWAY = '🚇', 'Метро'
        HOME = '🏠', 'Жильё'
        BILLS = '💡', 'Коммунальные услуги'
        PHONE = '📱', 'Связь'
        ENTERTAINMENT = '🎮', 'Развлечения'
        MOVIE = '🎬', 'Кино'
        MUSIC = '🎵', 'Музыка'
        HEALTH = '🏥', 'Здоровье'
        MEDICINE = '💊', 'Лекарства'
        TRAVEL = '✈️', 'Путешествия'
        VACATION = '🏝️', 'Отдых'
        CLOTHES = '👕', 'Одежда'
        SHOES = '👗', 'Обувь'
        EDUCATION = '📚', 'Образование'
        STUDY = '🎓', 'Учёба'
        GIFTS = '🎁', 'Подарки'

        # Доходы
        SALARY = '💼', 'Зарплата'
        FREELANCE = '💻', 'Фриланс'
        INVESTMENTS = '📈', 'Инвестиции'
        CASHBACK = '💰', 'Кэшбэк'
        BONUS = '🏆', 'Бонус'
        RENT = '🏘️', 'Аренда'
        DIVIDENDS = '📊', 'Дивиденды'

        # Другое
        OTHER = '📁', 'Другое'

    title = models.CharField(max_length=200)
    icon = models.CharField(max_length=10, choices=Icon.choices, default=Icon.OTHER)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.icon} {self.title}"