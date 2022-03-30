from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import UserDetails, BarberDetails, Emails, PasswordCodes, SignUpCodes, User, BankDetails, ServicesDetails

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(UserDetails)
admin.site.register(BarberDetails)
admin.site.register(Emails)
admin.site.register(SignUpCodes)
admin.site.register(PasswordCodes)
admin.site.register(BankDetails)
admin.site.register(ServicesDetails)