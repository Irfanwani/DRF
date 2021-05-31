from django.urls import path, include
from .api import RegisterView, LoginView, UserView, BarberAddressView, UserAddressView
from knox.views import LogoutView, LogoutAllView

urlpatterns = [
    path('api/auth', include('knox.urls')),
    path('api/auth/register', RegisterView.as_view()),
    path('api/auth/login', LoginView.as_view()),
    path('api/auth/user', UserView.as_view()),
    path('api/auth/logout', LogoutView.as_view(), name="knox_logout"),
    path('api/auth/logoutall', LogoutAllView.as_view(), name="knox_logoutall"),
    path('api/auth/barberaddress', BarberAddressView.as_view()),
    path('api/auth/useraddress', UserAddressView.as_view())
]
