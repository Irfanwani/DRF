from django.urls import path
from .views import AppointmentView, CancelAppointment

urlpatterns = [
    path('api/haircut/appointments', AppointmentView.as_view()),
    path('api/haircut/cancelappointment/<int:pk>', CancelAppointment.as_view()),
]