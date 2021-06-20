from django.urls import path, include
from .views import UserDetailsView, BarberDetailsView
from .register import RegistrationView, LoginView, EmailView, PasswordReset
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

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)