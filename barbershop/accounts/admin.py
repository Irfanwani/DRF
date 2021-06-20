from django.contrib import admin
from .models import UserDetails, BarberDetails, Emails, PasswordCodes, SignUpCodes

# Register your models here.
admin.site.register(UserDetails)
admin.site.register(BarberDetails)
admin.site.register(Emails)
admin.site.register(SignUpCodes)
admin.site.register(PasswordCodes)