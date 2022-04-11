from django.urls import path
from .views import AppointmentView, CancelAppointment, SaveToken, removeToken

urlpatterns = [
    path('appointments', AppointmentView.as_view()),
    path('cancelappointment/<int:pk>', CancelAppointment.as_view()),
    path('savetoken', SaveToken.as_view()),
    path('removetoken', removeToken.as_view()),
]