from django.contrib.gis.db import models
from django.contrib.auth.models import User

# User details
class UserDetails(models.Model):
    id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    image = models.ImageField(upload_to='images/', blank=True)
    coords = models.PointField(null=False, blank=False, srid=4326, verbose_name='coords')
    location = models.CharField(max_length=200, null=False, blank=False)
    about = models.CharField(max_length=1000, null=False, blank=True)
    website = models.URLField(max_length=200, null=False, blank=True)

    def __str__(self):
        return f"User details for user with id {self.id} added"


# Barber details
class BarberDetails(models.Model):
    id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    image = models.ImageField(upload_to='images/', blank=True)
    coords = models.PointField(null=False, blank=False, srid=4326, verbose_name='coords')
    location = models.CharField(max_length=200, null=False, blank=False)
    about = models.CharField(max_length=1000, null=False, blank=True)
    website = models.URLField(max_length=200, null=False, blank=True)
    employee_count = models.PositiveIntegerField(null=False, blank=False)


    def __str__(self):
        return f"Barber details for the user with id {self.id} added"