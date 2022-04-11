import razorpay

from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import permissions, status

from haircut.models import Appointments

from django.conf import settings

client = razorpay.Client(auth=(settings.RAZOR_KEY_ID, settings.RAZOR_KEY_SECRET))

class CreateOrder(GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):
        try:
            data = {
                'amount': int(request.data['amount'])*100,
                'currency': request.data['currency']
            }


            order = client.order.create(data=data)

            return Response(order)
        except:
            return Response({
                "error": "There is some error. Please try again"
            }, status.HTTP_408_REQUEST_TIMEOUT)

    def put(self, request):
        try:
            result = client.utility.verify_payment_signature(request.data)

            apnt_id = request.data['apnt_id']

            Appointments.objects.filter(id=apnt_id).update(paid=True)
            
            return Response({
                'message': result
            })
        except:
            return Response({
                'error': "There is some error. Please try again"
            }, status.HTTP_400_BAD_REQUEST)