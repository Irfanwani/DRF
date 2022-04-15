from django.contrib import admin
from .models import Appointments, NotificationTokens, RatingsAndReviews

# Register your models here.
admin.site.register(Appointments)
admin.site.register(NotificationTokens)
admin.site.register(RatingsAndReviews)
