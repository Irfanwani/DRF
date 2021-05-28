from django.db import models
from django.contrib.auth.models import User

# Appointment model
class Appointments(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meeting_username')
    barbername = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meeting_barbername')
    meeting_time = models.DateTimeField()

    def __str__(self):
        return f"{self.username} fixed an appointment with {self.barbername} on {self.meeting_time}"