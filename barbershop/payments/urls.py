from django.urls import path
from .views import CreateOrder

urlpatterns = [
    path('createorder', CreateOrder.as_view())
]