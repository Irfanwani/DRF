from rest_framework import generics, permissions
from rest_framework.response import Response

from knox.models import AuthToken

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, BarberAddressSerializer, UserAddressSerializer

from django.contrib.auth.models import User


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        token = AuthToken.objects.create(user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': token[1]
        })


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': token
        })


class UserView(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer

    def get_object(self):
        user = self.request.user
        return user


class BarberAddressView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = BarberAddressSerializer


    def post(self, request):
        user_id = request.user.id
        serializer = self.get_serializer(data={'id':user_id, **request.data})
        serializer.is_valid(raise_exception=True)
        address = serializer.save()

        print(address)

        return Response({'barberaddress': 'barberaddress'})


class UserAddressView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = UserAddressSerializer


    def post(self, request):
        user_id = request.user.id
        serializer = self.get_serializer(data={'id': user_id, **request.data})
        serializer.is_valid(raise_exception=True)
        address = serializer.save()

        print(address)

        return Response({'useraddress': 'useraddress'})