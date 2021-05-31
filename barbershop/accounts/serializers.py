from rest_framework import serializers
from .models import UserDetails, BarberDetails
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.gis.geos import Point

User._meta.get_field('email')._unique = True


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'username': {'min_length': 3}, 'password': {'write_only': True, 'min_length': 8}, 'email': {'required': True, 'allow_blank': False}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)

        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials!")



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')



class BarberAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarberDetails
        fields = ['id', 'image', 'coords', 'location', 'about', 'website', 'employee_count']
        extra_kwargs = {'employee_count': {'min_value': 1}}

    def create(self, validated_data):

        address = BarberDetails.objects.create(id=validated_data['id'], image=validated_data['image'], coords=Point(validated_data['coords']), location=validated_data['location'], about=validated_data['about'], website=validated_data['website'], employee_count=validated_data['employee_count'])

        return address



class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = ['id', 'image', 'coords', 'location', 'about', 'website']

    def create(self, validated_data):

        address = UserDetails.objects.create(id=validated_data['id'], image=validated_data['image'], coords=Point(validated_data['coords']), location=validated_data['location'], about=validated_data['about'], website=validated_data['website'])

        return address
    
