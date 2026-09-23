from django.db import migrations


CATEGORIES = {
    1: ("Продукты", "🛒"),
    2: ("Кафе и рестораны", "🍽️"),
    3: ("Транспорт", "🚗"),
    4: ("Жильё", "🏠"),
    7: ("Развлечения", "🎮"),
    8: ("Здоровье", "🏥"),
    9: ("Путешествия", "✈️"),
    13: ("Доход", "💼"),
    17: ("Другое", "📁"),
}


EXPENSE_RULES = (
    (3, ("проезд", "транспорт", "такси", "метро", "автобус", "бензин")),
    (1, ("продукт", "мяс", "еда", "хлеб", "магазин")),
    (2, ("кафе", "ресторан")),
    (4, ("жиль", "квартир", "аренд")),
    (7, ("развлеч", "кино", "игр")),
    (8, ("здоров", "лекар", "аптек")),
    (9, ("путеше", "отел", "билет")),
)


def seed_categories_and_assign_transactions(apps, schema_editor):
    Category = apps.get_model("expenses", "Category")
    Transaction = apps.get_model("expenses", "Transaction")

    for category_id, (title, icon) in CATEGORIES.items():
        Category.objects.update_or_create(
            pk=category_id,
            defaults={"title": title, "icon": icon},
        )

    for transaction in Transaction.objects.filter(category__isnull=True):
        if transaction.type == "income":
            category_id = 13
        else:
            title = (transaction.title or "").lower()
            category_id = 17
            for candidate_id, keywords in EXPENSE_RULES:
                if any(keyword in title for keyword in keywords):
                    category_id = candidate_id
                    break

        transaction.category_id = category_id
        transaction.save(update_fields=["category"])


class Migration(migrations.Migration):

    dependencies = [
        ("expenses", "0002_align_transaction_fields"),
    ]

    operations = [
        migrations.RunPython(seed_categories_and_assign_transactions, migrations.RunPython.noop),
    ]
