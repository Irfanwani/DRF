from django.urls import path

from .views import AppointmentView, CancelAppointment, SaveToken, removeToken
from .views2 import RatingsView

urlpatterns = [
    path('appointments', AppointmentView.as_view()),
    path('cancelappointment/<int:pk>', CancelAppointment.as_view()),
    path('savetoken', SaveToken.as_view()),
    path('removetoken', removeToken.as_view()),
    path('reviews', RatingsView.as_view())
]
