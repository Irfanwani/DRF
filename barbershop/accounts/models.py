from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser

from django.core.exceptions import ValidationError

# Create your models here.
# Auth models

class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)


class Emails(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()

    def __str__(self):
        return f'Email {self.email} verified for the user {self.user}'


class SignUpCodes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=15)

    def __str__(self):
        return f'{self.code} created for user {self.user}'


class PasswordCodes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=15)

    def __str__(self):
        return f'{self.code} created for user {self.user}'


# Checking if user has provided address details
def unique_validator(id):
    if(len(BarberDetails.objects.filter(id=id)) > 0 or len(UserDetails.objects.filter(id=id)) > 0):
        raise ValidationError(
            'details already added. Please try logging out and logging back in.')


# Detail models
class UserDetails(models.Model):
    id = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, validators=[unique_validator])
    image = models.ImageField(upload_to='image/')
    coords = models.PointField(
        null=False, blank=False, srid=4326, verbose_name='coords')
    location = models.CharField(max_length=1000)
    about = models.TextField(null=False, blank=True)
    contact = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f'User details for the user {self.id} added'


class BarberDetails(models.Model):
    id = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, validators=[unique_validator])
    image = models.ImageField(upload_to='image/')
    coords = models.PointField(
        null=False, blank=False, srid=4326, verbose_name='coords')
    location = models.CharField(max_length=1000)
    about = models.TextField(null=False, blank=True)
    contact = models.CharField(max_length=200, blank=True)
    employee_count = models.PositiveIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f'Barber details for the user {self.id} added'
