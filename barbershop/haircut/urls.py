from django.urls import path
from .views import AppointmentView, CancelAppointment, SaveToken, removeToken

urlpatterns = [
    path('api/haircut/appointments', AppointmentView.as_view()),
    path('api/haircut/cancelappointment/<int:pk>', CancelAppointment.as_view()),
    path('api/haircut/savetoken', SaveToken.as_view()),
    path('api/haircut/removetoken', removeToken.as_view()),
]