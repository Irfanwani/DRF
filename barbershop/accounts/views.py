from django.http.request import QueryDict

from rest_framework.views import APIView
from rest_framework import generics, permissions, status

from .models import BarberDetails, UserDetails
from .serializers import UserDetailSerializer, BarberDetailSerializer
from .register import check

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from django.contrib.gis.geos import Point

from django.conf import settings
from django.core.mail import send_mail
from datetime import datetime
# Create your views here.


class UserDetailsView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = UserDetailSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        if isinstance(request.data, QueryDict):
            request.data._mutable = True
        try:
            coords = Point(
                float(request.data['lng']), float(request.data['lat']))
        except:
            return Response({
                'message': 'Something went wrong. Please try again.'
            }, status.HTTP_400_BAD_REQUEST)

        request.data.update({'id': request.user.id, 'coords': coords})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.save()

        send_mail(subject='Details saved successfully!', message="Your details were saved successfully",
                  from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])

        return Response({
            'details': UserDetailSerializer(details, context=self.get_serializer_context()).data
        })

    def put(self, request):
        if isinstance(request.data, QueryDict):
            request.data._mutable = True

        try:
            coords = Point(
                float(request.data['lng']), float(request.data['lat']))
            request.data.update({'coords': coords})
        except:
            pass

        serializer = self.get_serializer(UserDetails.objects.get(
            id=request.user.id), data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        details = serializer.save()

        send_mail(subject='Details updated successfully!', message="Your details were updated successfully",
                  from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])

        return Response({
            'details': UserDetailSerializer(details, context=self.get_serializer_context()).data
        })


class BarberDetailsView(generics.GenericAPIView):
    queryset = BarberDetails.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = BarberDetailSerializer
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        if isinstance(request.data, QueryDict):
            request.data._mutable = True

        try:
            coords = Point(
                float(request.data['lng']), float(request.data['lat']))
        except:
            return Response({
                'message': 'Something went wrong. Please try again.'
            }, status.HTTP_400_BAD_REQUEST)

        try:
            start_time = request.data['start_time']
            end_time = request.data['end_time']

            parsed_st = datetime.strptime(start_time, "%H:%M").time()
            parsed_et = datetime.strptime(end_time, "%H:%M").time()
        except:
            return Response({
                'start_end_error': 'Please provide both opening and closing time of your barbershop.'
            }, status.HTTP_400_BAD_REQUEST)

        request.data.update({'id': request.user.id, 'coords': coords,
                            'start_time': parsed_st, 'end_time': parsed_et})

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        details = serializer.save()

        send_mail(subject='Details saved successfully!', message="Your details were saved successfully",
                  from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])

        return Response({
            'details': BarberDetailSerializer(details, context=self.get_serializer_context()).data
        })

    def put(self, request):
        if isinstance(request.data, QueryDict):
            request.data._mutable = True

        try:
            coords = Point(
                float(request.data['lng']), float(request.data['lat']))
            request.data.update({'coords': coords})
        except:
            pass

        try:
            start_time = request.data['start_time']
            end_time = request.data['end_time']

            parsed_st = datetime.strptime(start_time, "%H:%M").time()
            parsed_et = datetime.strptime(end_time, "%H:%M").time()
            request.data.update(
                {'start_time': parsed_st, 'end_time': parsed_et})
        except:
            pass

        serializer = self.get_serializer(BarberDetails.objects.get(
            id=request.user.id), data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        details = serializer.save()

        send_mail(subject='Details updated successfully!', message="Your details were updated successfully",
                  from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])

        return Response({
            'details': BarberDetailSerializer(details, context=self.get_serializer_context()).data
        })


class GetBarber(generics.RetrieveAPIView):
    queryset = BarberDetails.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = BarberDetailSerializer


class GetUser(generics.RetrieveAPIView):
    queryset = UserDetails.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = UserDetailSerializer


class AuthenticateUser(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        verified, details, account_added, services_added = check(request.user.email, request.user.username, request)

        return Response({
            'verified': verified,
            'details': details,
            'account_added': account_added,
            'services_added': services_added
        })
