from django.contrib import admin
from .models import UserDetails, BarberDetails

# Register your models here.
admin.site.register(UserDetails)
admin.site.register(BarberDetails)