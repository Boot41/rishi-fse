# Generated by Django 5.1.6 on 2025-02-21 06:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='financialprofile',
            name='monthly_salary',
            field=models.DecimalField(decimal_places=2, default=10000, max_digits=12),
            preserve_default=False,
        ),
    ]
