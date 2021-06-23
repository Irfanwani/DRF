from django.db import models
from accounts.models import BarberDetails
from django.contrib.auth.models import User

# Create your models here.
class Appointments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    barber = models.ForeignKey(BarberDetails, on_delete=models.CASCADE)
    datetime = models.DateTimeField()

    def __str__(self):
        return f'{self.user} fixed an appointment with {self.barber} on {self.datetime}'