from rest_framework import permissions, generics
from rest_framework.response import Response
from django.core.mail import send_mail
from accounts.models import BarberDetails
from django.contrib.auth.models import User

from .models import Appointments
from .serializers import AppointmentSerializer
from datetime import datetime, timedelta
from django.conf import settings


# Create your views here.
class AppointmentView(generics.GenericAPIView):
    queryset = Appointments.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = AppointmentSerializer

    def get(self, request):

        serializer = self.get_serializer(
            self.get_queryset().filter(user=request.user), many=True)

        # Converting datetime into human-readable string
        [app.update({'datetime': datetime.strptime(
            app['datetime'], "%Y-%m-%dT%H:%M:%SZ").strftime("%A, %b %d, %Y %I:%M:%S %p")}) for app in serializer.data]

        appointments = serializer.data

        if len(appointments) <= 0:
            return Response({
                'message': "No appointment fixed!"
            })

        return Response(appointments)

    def post(self, request):
        # Check if the barber exists
        try:
            barber = BarberDetails.objects.get(
                id=User.objects.get(username=request.data['barber']).id)
        except:
            return Response({
                'message': 'This barber has no saved details. Please check again.'
            })

        # check if a valid datetime format was given
        try:
            dt = request.data['datetime']
            parsedDate = datetime.strptime(dt, "%d/%m/%Y %I:%M %p")
        except:
            return Response({
                'message': "please provide a valid date and time for the appointment."
            })

        # Check if datetime is in future not past or present and receiving the current datetime from the frontend
        try:
            currentDateTime = request.data['currentdatetime']
            parsedCurrentDate = datetime.strptime(currentDateTime, "%m/%d/%Y, %I:%M:%S %p")

            if parsedDate <= parsedCurrentDate:
                return Response({
                    'message': 'Please choose a valid date and time. You can\'t submit an appointment for a past time.'
                })
        except:
            return Response({
                'message': 'There was some problem. Please try again!'
            })

        # Check if all spots all taken for a particular time
        try:
            apnts = Appointments.objects.filter(barber=barber)
            takenSpots = [apnt.datetime for apnt in apnts if datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p") == parsedDate]
            
            if len(takenSpots) >= barber.employee_count:
                return Response({
                    'message': 'All spots for the selected time are already taken! Please select a different time.'
                })

            fixedAppointments = [apnt.datetime for apnt in apnts if (parsedDate - timedelta(minutes=15) < datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p") and parsedDate > datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p")) or (parsedDate + timedelta(minutes=15) > datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p") and parsedDate < datetime.strptime(apnt.datetime.strftime("%d/%m/%Y %I:%M %p"), "%d/%m/%Y %I:%M %p"))]

            if len(fixedAppointments) > 0:
                return Response({
                    'message': 'This time cannot be selected as nearby spots are already taken. Please try increasing your time by multiples of 15 minutes.'
                })

            
        except:
            pass

        # After this, only validation error can occur
        request.data.update(
            {'user': request.user.id, 'barber': barber.id, 'datetime': parsedDate})

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        send_mail(subject='Appointment fixed successfully.', message='Appointment fixed successfully!', from_email=getattr(
            settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{request.user.email}', f'{barber.id.email}'])

        return Response({
            'message': "appointment fixed successfully!"
        })
