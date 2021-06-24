from accounts.models import UserDetails, BarberDetails
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.gis.geos import Point
# user serialization
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


# registration serialization here
class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'username': {'min_length': 3}, 'password': {
            'write_only': True, 'min_length': 8}, 'email': {'required': True, 'allow_blank': False}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])

        return user

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance


# Login validation and serialization
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)

        if user and user.is_active:
            return user
        raise serializers.ValidationError('Incorrect credentials')


# User details serialization
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        fields = '__all__'

    def update(self, instance, validated_data):
        try:
            instance.image = validated_data['image']
        except:
            pass
        try:
            instance.coords = validated_data['coords']
        except:
            pass
        try:
            instance.location = validated_data['location']
        except:
            pass
        try:
            instance.about = validated_data['about']
        except:
            pass
        try:
            instance.contact = validated_data['contact']
        except:
            pass
        instance.save()
        return instance

# Barber details serialization
class BarberDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BarberDetails
        fields = '__all__'

    def update(self, instance, validated_data):
        try:
            instance.image = validated_data['image']
        except:
            pass
        try:
            instance.coords = validated_data['coords']
        except:
            pass
        try:
            instance.location = validated_data['location']
        except:
            pass
        try:
            instance.about = validated_data['about']
        except:
            pass
        try:
            instance.contact = validated_data['contact']
        except:
            pass
        try:
            instance.employee_count = validated_data['employee_count']
        except:
            pass
        instance.save()
        return instance