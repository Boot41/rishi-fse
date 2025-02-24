from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ("api", "0006_financialprofile_monthly_savings"),
    ]

    operations = [
        migrations.AddField(
            model_name="financialprofile",
            name="monthly_savings",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
