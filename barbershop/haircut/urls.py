from django.urls import path
from .views import AppointmentView

urlpatterns = [
    path('api/haircut/appointments', AppointmentView.as_view()),
]