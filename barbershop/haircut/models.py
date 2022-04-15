from django.db import models
from accounts.models import BarberDetails, User

# Create your models here.
class Appointments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    barber = models.ForeignKey(BarberDetails, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    bookingID = models.PositiveIntegerField()
    services = models.CharField(max_length=1000, blank=False, null=False)
    totalcost = models.PositiveIntegerField()
    paid = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user} fixed an appointment with {self.barber} on {self.datetime}'


class NotificationTokens(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return f'{self.user} has token {self.token}'


class RatingsAndReviews(models.Model):
    barber = models.ForeignKey(BarberDetails, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ratings = models.PositiveIntegerField()
    comments = models.CharField(max_length=1000, blank=True, null=True)


    def __str__(self):
        return f'{self.ratings} for {self.barber} by {self.user}'