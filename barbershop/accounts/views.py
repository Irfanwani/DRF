from rest_framework import generics, permissions
from .serializers import UserDetailSerializer, BarberDetailSerializer

from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.response import Response

from django.contrib.gis.geos import Point

from django.conf import settings
from django.core.mail import send_mail
# Create your views here.


class UserDetailsView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserDetailSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        coords = Point(int(request.data['lng']), int(request.data['lat']))

        request.data.update({'id': request.user.id, 'coords': coords})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.save()

        send_mail(subject='Details saved successfully!', message="Your details were saved successfully", from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])

        return Response({
            'details': UserDetailSerializer(details, context=self.get_serializer_context()).data
        })


class BarberDetailsView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = BarberDetailSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        coords = Point(int(request.data['lng']), int(request.data['lat']))

        request.data.update({'id': request.user.id, 'coords': coords})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.save()

        
        send_mail(subject='Details saved successfully!', message="Your details were saved successfully", from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])


        return Response({
            'details': BarberDetailSerializer(details, context=self.get_serializer_context()).data
        })


