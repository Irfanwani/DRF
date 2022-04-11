from django.urls import path, include

from accounts.views2 import BankView, ServicesView, BarberFilter
from .views import GetUser, UserDetailsView, BarberDetailsView, GetBarber, AuthenticateUser
from .register import RegistrationView, LoginView, EmailView, PasswordReset, DeleteUser
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('knox.urls')),
    path('register', RegistrationView.as_view()),
    path('login', LoginView.as_view()),
    path('verifyemail', EmailView.as_view()),
    path('passwordreset', PasswordReset.as_view()),
    path('userdetails', UserDetailsView.as_view()),
    path('barberdetails', BarberDetailsView.as_view()),
    path('deleteuser/<int:pk>', DeleteUser.as_view()),
    path('getbarber/<int:pk>', GetBarber.as_view()),
    path('getuser/<int:pk>', GetUser.as_view()),
    path('authenticateuser', AuthenticateUser.as_view()),
    path('createbank', BankView.as_view()),
    path('addservices', ServicesView.as_view()),
    path('filterbarbers', BarberFilter.as_view()),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
