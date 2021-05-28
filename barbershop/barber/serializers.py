from rest_framework import serializers
from .models import Appointments

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointments
        fields = ('meeting_time',)