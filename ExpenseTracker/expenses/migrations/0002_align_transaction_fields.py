from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("expenses", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="transaction",
            old_name="description",
            new_name="title",
        ),
        migrations.RenameField(
            model_name="transaction",
            old_name="transaction_type",
            new_name="type",
        ),
        migrations.AlterField(
            model_name="transaction",
            name="date",
            field=models.DateField(auto_now=True, verbose_name="Дата"),
        ),
    ]
