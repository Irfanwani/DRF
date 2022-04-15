from rest_framework import serializers
from .models import Appointments, NotificationTokens, RatingsAndReviews


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointments
        fields = '__all__'


class NotificationTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTokens
        fields = '__all__'


class RatingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingsAndReviews
        fields = '__all__'
