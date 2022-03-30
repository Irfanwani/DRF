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



BUSINESS_CHOICES = (
    ('individual', 'individual'),
    ('partnership', 'partnership'),
    ('proprietorship', 'proprietorship'),
    ('not_yet_registered', 'not_yet_registered')
)

ACCOUNT_CHOICES = (
    ('savings', 'savings'),
    ('current', 'current')
)

class BankDetails(models.Model):
    id = models.OneToOneField(BarberDetails, on_delete=models.CASCADE, primary_key=True)
    business_name = models.CharField(max_length=100, blank=False, null=False)
    business_type = models.CharField(max_length=100, blank=False, null=False, choices=BUSINESS_CHOICES)

    beneficiary_name = models.CharField(max_length=60, null=False, blank=False)
    account_number = models.PositiveBigIntegerField(null=False, blank=False)
    ifsc_code = models.CharField(max_length=20, blank=False, null=False)
    account_type = models.CharField(max_length=60, blank=True, null=True, choices=ACCOUNT_CHOICES)

    account_id = models.CharField(max_length=60, null=False, blank=False)
    destination = models.CharField(max_length=60, null=False, blank=False)

    def __str__(self):
        return f'Account with account_id {self.account_id} and beneficiary name {self.beneficiary_name} created'


SERVICE_CHOICES = (
    ('barbershop', 'barbershop'),
    ('hair_salon', 'hair_salon'),
    ('beauty_salon', 'beauty_salon'),
    ('full_service_salon', 'full_service_salon'),
    ('other', 'other'),
)

class ServicesDetails(models.Model):
    service_provider = models.ForeignKey(BarberDetails, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=60, blank=False, null=False, choices=SERVICE_CHOICES)
    service = models.CharField(max_length=100, blank=False, null=False)
    cost = models.PositiveIntegerField(blank=False, null=False)

    def __str__(self):
        return f"service '{self.service}' with cost {self.cost} added"