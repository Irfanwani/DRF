from rest_framework import serializers
from .models import Appointments
from datetime import datetime, timedelta

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointments
        fields = '__all__'
        
        
        
