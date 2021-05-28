from django.contrib.gis.db import models
from django.contrib.auth.models import User

# User details
class UserDetails(models.Model):
    id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"User details for user with id {self.id} added"


# Barber details
class BarberDetails(models.Model):
    id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_count = models.IntegerField()


    def __str__(self):
        return f"Barber details for the user with id {self.id} added"