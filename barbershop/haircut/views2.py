from django.http import QueryDict
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated

from accounts.models import BarberDetails, User
from .models import RatingsAndReviews
from .serializers import RatingsSerializer


class RatingsView(GenericAPIView):
    serializer_class = RatingsSerializer
    queryset = RatingsAndReviews.objects.all()

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):
        try:
            barber_id = request.query_params['barber_id']
            serializer = self.get_serializer(
                self.get_queryset().filter(barber=barber_id), many=True)

            [i.update({'user': User.objects.get(id=i['user']).username})
             for i in serializer.data]

            return Response(serializer.data)

        except:
            return Response({
                'error': "There is some error. Please try again"
            }, status.HTTP_408_REQUEST_TIMEOUT)

    def post(self, request):
        try:
            if isinstance(request.data, QueryDict):
                request.data._mutable = True

            barber = BarberDetails.objects.get(
                id=User.objects.get(username=request.data['barber']).id)
            request.data.update({'barber': barber.id, 'user': request.user.id})

            serializer = self.get_serializer(data=request.data)

            serializer.is_valid(raise_exception=True)

            serializer.save()

            return Response({
                'review': 'Done'
            })
        except:
            return Response({
                'error': "There is some error. Please try again"
            }, status.HTTP_408_REQUEST_TIMEOUT)

    def delete(self, request):
        try:
            comment = self.get_queryset().get(id=request.data['id'])
            if comment.user.username == request.user.username:
                comment.delete()
                return Response({
                    'msg': "Done"
                })
            else:
                return Response({
                    "error": "Not authorized to perform this action"
                }, status.HTTP_403_FORBIDDEN)

        except:
            return Response({
                'error': "There is some error. Please try again"
            }, status.HTTP_408_REQUEST_TIMEOUT)
