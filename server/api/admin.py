from django.contrib import admin
from .models import FinancialProfile, Income, Expense, Investment

admin.site.register(FinancialProfile)
admin.site.register(Income)
admin.site.register(Expense)
admin.site.register(Investment)
