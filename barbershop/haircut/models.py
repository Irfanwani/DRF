from django.db import models
from accounts.models import BarberDetails, User

# Create your models here.
class Appointments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    barber = models.ForeignKey(BarberDetails, on_delete=models.CASCADE)
    datetime = models.DateTimeField()

    def __str__(self):
        return f'{self.user} fixed an appointment with {self.barber} on {self.datetime}'


class NotificationTokens(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return f'{self.user} has token {self.token}'