from django.db.models import Q
from django.http.request import QueryDict
from rest_framework import permissions, generics, serializers, status
from rest_framework.response import Response
from django.core.mail import send_mail
from accounts.models import User, BarberDetails

from .models import Appointments, NotificationTokens
from .serializers import AppointmentSerializer, NotificationTokenSerializer
from datetime import datetime, timedelta
from django.conf import settings

import random

def getUniqueCode(query):
  code = random.randint(10000000, 99999999)

  if code not in query:
    return code
  getUniqueCode()




# Create your views here.
class AppointmentView(generics.GenericAPIView):
    queryset = Appointments.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = AppointmentSerializer

    def get(self, request):
        try:
            serializer = self.get_serializer(
                self.get_queryset().filter(Q(user=request.user) | Q(barber=BarberDetails.objects.get(id=request.user.id))).order_by('-paid'), many=True)
        except:
            serializer = self.get_serializer(
                self.get_queryset().filter(user=request.user).order_by('-paid'), many=True)

        # Converting datetime into human-readable string
        [app.update({'datetime': datetime.strptime(
            app['datetime'], "%Y-%m-%dT%H:%M:%SZ").strftime("%A, %b %d, %Y %I:%M:%S %p"), 'user': User.objects.get(id=app['user']).username, 'barber': User.objects.get(id=app['barber']).username}) for app in serializer.data]

        appointments = serializer.data

        if len(appointments) <= 0:
            return Response({
                'message': "No appointment fixed!"
            }, status.HTTP_404_NOT_FOUND)

        return Response(appointments)

    def post(self, request):
        if isinstance(request.data, QueryDict):
            request.data._mutable = True
        # Check if the barber exists
        try:
            barber = BarberDetails.objects.get(
                id=User.objects.get(username=request.data['barber']).id)
        except:
            return Response({
                'message': 'This barber has no saved details. Please check again.'
            }, status.HTTP_404_NOT_FOUND)

        # Check if 3 or less services are selected
        try:
            services = request.data['services'].split('|')
            if len(services) > 3:
                return Response({
                    'error': "You cannot select more than 3 services."
                }, status.HTTP_406_NOT_ACCEPTABLE)
        except:
            return Response({
                'error': "Please select some services."
            }, status.HTTP_406_NOT_ACCEPTABLE)

        # check if a valid datetime format and in proper range was given
        try:
            dt = request.data['datetime']
            parsedDate = datetime.strptime(dt, "%a %b %d %Y %H:%M")
            if parsedDate.time() < barber.start_time or parsedDate.time() > barber.end_time:
                return Response({
                    'message': f'Please select a time from {barber.start_time.strftime("%I:%M %p")} to {barber.end_time.strftime("%I:%M %p")}'
                }, status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'message': "please provide a valid date and time for the appointment."
            }, status.HTTP_400_BAD_REQUEST)

        # Check if datetime is in future not past or present and receiving the current datetime from the frontend
        try:
            currentDateTime = request.data['currentdatetime']
            parsedCurrentDate = datetime.strptime(
                currentDateTime, "%a %b %d %Y %H:%M")

            if parsedDate <= parsedCurrentDate:
                return Response({
                    'message': 'Please choose a valid date and time. Future times are only treated as valid.'
                }, status.HTTP_400_BAD_REQUEST)
        except:
            return Response({
                'message': 'There was some problem. Please try again!'
            }, status.HTTP_400_BAD_REQUEST)

        # Check if all spots all taken for a particular time otherwise return the error message and the taken times.
        try:
            apnts = Appointments.objects.filter(barber=barber)
            takenSpots = [apnt.datetime for apnt in apnts if datetime.strptime(
                apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p") == parsedDate]
            if len(takenSpots) >= barber.employee_count:
                return Response({
                    'message': 'All spots for the selected time are already taken! Please select a different time.',
                    'takendates': [apnt.datetime.strftime("%A, %b %d, %Y %I:%M %p") for apnt in apnts]
                }, status.HTTP_406_NOT_ACCEPTABLE)

            fixedAppointments = [apnt.datetime for apnt in apnts if (parsedDate - timedelta(minutes=(20 * len(apnt.services.split('|')))) < datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p") and parsedDate > datetime.strptime(apnt.datetime.strftime(
                "%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p")) or (parsedDate + timedelta(minutes=(20 * len(apnt.services.split('|')))) > datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p") and parsedDate < datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p"))]

            if len(fixedAppointments) > 0:
                return Response({
                    'message': 'This time cannot be selected as nearby spots are already taken. Please try increasing your time by multiples of 20 minutes.',
                    'takendates': [apnt.datetime.strftime("%A, %b %d, %Y %I:%M %p") for apnt in apnts]

                }, status.HTTP_406_NOT_ACCEPTABLE)

        except:
            pass

        # After this, only validation error can occur
        queryList = Appointments.objects.filter(barber=barber)
        query = [queryList[i].bookingID for i in range(len(queryList))]

        code = getUniqueCode(query)

        request.data.update(
            {'user': request.user.id, 'barber': barber.id, 'datetime': parsedDate, 'bookingID': code})

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()



        send_mail(subject='Appointment fixed successfully.', message=f'Appointment fixed successfully! Here is your booking ID: {code}', from_email=getattr(
            settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}'])



        try:
            querylist = NotificationTokens.objects.filter(
                user=User.objects.get(username=request.data['barber']))
            tokenlist = [querylist[i].token for i in range(len(querylist))]
        except:
            tokenlist = None

        return Response({
            'message': "appointment fixed successfully!",
            "tokenlist": tokenlist
        })


class CancelAppointment(generics.DestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    queryset = Appointments.objects.all()
    serializer_class = AppointmentSerializer

    def perform_destroy(self, instance):
        if instance.user == self.request.user:
            return instance.delete()

        raise serializers.ValidationError(
            'You cannot change other\'s appointment.')


class SaveToken(generics.CreateAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    queryset = NotificationTokens.objects.all()

    serializer_class = NotificationTokenSerializer

    def perform_create(self, serializer):
        queryList = NotificationTokens.objects.filter(
            user=self.request.user, token=self.request.data['token'])
        if queryList.exists():
            return
        serializer.save()


class removeToken(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        try:
            NotificationTokens.objects.get(
                user=request.user, token=request.data['token']).delete()
        except:
            pass
        return Response({
            'msg': 'logout success'
        })

    def put(self, request):
        try:
            NotificationTokens.objects.filter(user=request.user).delete()
        except:
            pass
        return Response({
            'msg': 'logout success'
        })
