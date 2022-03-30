from django.urls import path, include

from accounts.views2 import BankView, ServicesView, BarberFilter
from .views import GetUser, UserDetailsView, BarberDetailsView, GetBarber, AuthenticateUser
from .register import RegistrationView, LoginView, EmailView, PasswordReset, DeleteUser
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/accounts/', include('knox.urls')),
    path('api/accounts/register', RegistrationView.as_view()),
    path('api/accounts/login', LoginView.as_view()),
    path('api/accounts/verifyemail', EmailView.as_view()),
    path('api/accounts/passwordreset', PasswordReset.as_view()),
    path('api/accounts/userdetails', UserDetailsView.as_view()),
    path('api/accounts/barberdetails', BarberDetailsView.as_view()),
    path('api/accounts/deleteuser/<int:pk>', DeleteUser.as_view()),
    path('api/accounts/getbarber/<int:pk>', GetBarber.as_view()),
    path('api/accounts/getuser/<int:pk>', GetUser.as_view()),
    path('api/accounts/authenticateuser', AuthenticateUser.as_view()),
    path('api/accounts/createbank', BankView.as_view()),
    path('api/accounts/addservices', ServicesView.as_view()),
    path('api/accounts/filterbarbers', BarberFilter.as_view()),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
