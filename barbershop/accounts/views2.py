from rest_framework.response import Response
from rest_framework import generics, permissions, status
from accounts.models import BarberDetails, ServicesDetails, UserDetails, User
from accounts.serializers import BankDetailsSerializer, BarberDetailSerializer, ServicesSerializer

from django.contrib.gis.db.models.functions import Distance
from django.db.models import Count, Avg
from django.db.models.functions import Round
from django.db import transaction


from django.conf import settings

from datetime import datetime

import requests
import json
import math

from haircut.models import RatingsAndReviews


class BankView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = BankDetailsSerializer

    def post(self, request):
        try:
            res = requests.post(url=settings.RAZOR_URL, data=json.dumps(request.data), auth=(settings.RAZOR_KEY_ID,
                                                                                             settings.RAZOR_KEY_SECRET), headers={'Content-type': 'application/json'})

            response = json.loads(res.text)

            try:
                error = response['error']
                return Response({
                    'error': error['description']
                }, status=status.HTTP_400_BAD_REQUEST)

            except:
                data = {**request.data['account_details'],
                        **request.data['bank_account']}

                barber = request.user.id
                account_id = response['id']
                destination = response['fund_transfer']['destination']

                data.update({'id': barber, 'account_id': account_id,
                            'destination': destination})

                serializer = self.get_serializer(data=data)

                serializer.is_valid(raise_exception=True)

                serializer.save()

                return Response({
                    'account_added': True
                }, status=status.HTTP_201_CREATED)

        except:
            return Response({
                'error': 'There was some error. Please try again'
            }, status=status.HTTP_400_BAD_REQUEST)


class ServicesView(generics.GenericAPIView):
    serializer_class = ServicesSerializer
    queryset = ServicesDetails.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        try:
            service_provider = request.query_params['id']

            queries = self.get_queryset().filter(
                service_provider=service_provider).values('id', 'service', 'cost')

            return Response(queries)
        except:
            return Response({
                'error': "There is some error. Please try again"
            }, status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            barber = BarberDetails.objects.get(
                id=request.user.id)

            servicesSelected = request.data['services_list']

            servicesList = [ServicesDetails(service_provider=barber, service_type=request.data['service_type'],
                                            service=servicesSelected[i]['service'], cost=int(servicesSelected[i]['cost']) + math.ceil(int(servicesSelected[i]['cost'])/10)) for i in range(len(servicesSelected))]

            ServicesDetails.objects.bulk_create(servicesList)

            return Response({
                'services_added': True
            })
        except:
            return Response({
                'error': 'There is some error. Please try again'
            }, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request):
        try:
            with transaction.atomic():
                services = request.data['services_list']

                for i in services:
                    self.get_queryset().filter(id=i['id']).update(cost=i['cost'])

            return Response({
                'message': "Updated"
            })
        except:
            return Response({
                'error': 'There is some error. Please try again'
            }, status.HTTP_400_BAD_REQUEST)
            

class BarberFilter(generics.GenericAPIView):
    serializer_class = BarberDetailSerializer
    queryset = ServicesDetails.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        try:
            try:
                user = UserDetails.objects.get(id=request.user.id)
            except:
                user = BarberDetails.objects.get(id=request.user.id)
        except:
            return Response({
                'error': "Please provide your address details to access barber details"
            }, status.HTTP_403_FORBIDDEN)
        try:
            start = request.data['start']
            end = request.data['end']
        except:
            start = 0
            end = 10

        try:
            service_type = request.data['service_type']
            service_providers = [i['service_provider'] for i in self.get_queryset().filter(service_type=service_type).annotate(
                distance=Distance('service_provider__coords', user.coords, spheroid=True)).order_by('distance').values('service_provider')]

            barbers = BarberDetails.objects.filter(
                id__in=service_providers).annotate(distance=Distance('coords', user.coords, spheroid=True))[start:end]

        except:
            barbers = BarberDetails.objects.all().annotate(distance=Distance(
                'coords', user.coords, spheroid=True)).order_by('distance')[start:end]

        try:
            selected_services = request.data['services']
            queries = [i['service_provider'] for i in self.get_queryset().values('service_provider').filter(service__in=selected_services).annotate(
                ct=Count('service_provider')).filter(ct__gte=len(selected_services)).annotate(distance=Distance('service_provider__coords', user.coords, spheroid=True)).order_by('distance')[start:end]]

            barbers = BarberDetails.objects.filter(id__in=queries).annotate(
                distance=Distance('coords', user.coords, spheroid=True))

        except:
            pass

        serializer = self.get_serializer(barbers, many=True)

        [barber.update({'username': User.objects.get(id=barber['id']).username, 'avg_ratings': RatingsAndReviews.objects.filter(barber=barber['id']).aggregate(avg_ratings=Round(Avg('ratings'), 2))['avg_ratings'], 'Distance': [round(b.distance.km, 2)
                                                                                                                                                                                                                                  for b in barbers if b.id == User.objects.get(id=barber['id'])][0], 'start_time': datetime.strptime(barber['start_time'], "%H:%M:%S").strftime("%I:%M %p"), 'end_time': datetime.strptime(barber['end_time'], "%H:%M:%S").strftime("%I:%M %p")}) for barber in serializer.data]

        return Response(serializer.data)
