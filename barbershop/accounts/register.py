from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response

from knox.models import AuthToken
from .serializers import BarberDetailSerializer, RegistrationSerializer, UserDetailSerializer, UserSerializer, LoginSerializer
from .models import User, BarberDetails, Emails, PasswordCodes, SignUpCodes, UserDetails, BankDetails, ServicesDetails

from django.core.mail import send_mail

from django.conf import settings

# code generator
import random
import string


def verificationCode():
    specials = "@#$%^&*"
    return ''.join([random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits + specials) for n in range(random.randint(8, 12))])


# email verificationand details check
def check(email, user, request):
    try:
        Emails.objects.get(email=email)
        verified = 'verified'
    except:
        verified = None

    try:
        try:
            barber = BarberDetails.objects.get(
                id=User.objects.get(username=user).id)

            details = BarberDetailSerializer(barber, context={'request': request}).data

            try:
                BankDetails.objects.get(id=barber)
                account_added = True
            except:
                account_added = False

            if len(ServicesDetails.objects.filter(service_provider=barber)) > 0:
                services_added = True
            else:
                services_added = False

        except:
            details = UserDetailSerializer(UserDetails.objects.get(
                id=User.objects.get(username=user).id), context={'request': request}).data
            account_added = False
            services_added = False
    except:
        details = None
        account_added = False
        services_added = False

    return verified, details, account_added, services_added


# Registration
class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # verification code creation and send to the user email
        verCode = verificationCode()

        try:
            SignUpCodes.objects.filter(
                user=User.objects.get(username=user)).delete()
        except:
            pass

        SignUpCodes.objects.create(
            user=User.objects.get(username=user), code=verCode)
        send_mail(subject='Email verification', message=f'Registration successfull. Here is the email verification code {verCode}', from_email=getattr(
            settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{request.data['email']}"], fail_silently=False)

        _, token = AuthToken.objects.create(user)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': token
        })


# Email verification
class EmailView(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):
        code = verificationCode()
        try:
            Emails.objects.get(user=User.objects.get(
                username=request.user.username))
            return Response({
                'verified': 'verified',
                'message': 'Email already verified'
            })
        except:
            try:
                SignUpCodes.objects.filter(
                    user=User.objects.get(username=request.user)).delete()
            except:
                pass

            SignUpCodes.objects.create(user=request.user, code=code)

            send_mail(subject='Email verification', message=f'Here is the email verification code {code}', from_email=getattr(
                settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{request.user.email}"], fail_silently=False)

            return Response({
                'message': 'Email verification code sent to your email.'
            })

    def post(self, request):
        try:
            Emails.objects.get(user=User.objects.get(
                username=request.user.username))
            return Response({
                'verified': 'verified',
                'message': 'Email already verified'
            })

        except:
            try:
                code = request.data['code']
            except:
                return Response({
                    'message': 'Please provide a verification code'
                }, status.HTTP_400_BAD_REQUEST)

            try:
                db_code = SignUpCodes.objects.get(
                    user=User.objects.get(username=request.user.username)).code

                if code == db_code:
                    Emails.objects.create(user=User.objects.get(
                        username=request.user.username), email=User.objects.get(username=request.user.username).email)

                    SignUpCodes.objects.filter(user=User.objects.get(
                        username=request.user.username)).delete()

                    send_mail(subject='Registration success!', message=f'Registration successfull. You successfully registered', from_email=getattr(
                        settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{request.user.email}"], fail_silently=False)

                    return Response({
                        'verified': 'verified',
                        'message': 'Email address verified! Registration completed!'
                    })

                return Response({
                    'message': 'Please provide a valid verification code.'
                }, status.HTTP_400_BAD_REQUEST)
            except:
                return Response({
                    'message': "There is no code registered on your name. Click the 'resend' button to receive the code on your registered email."
                }, status.HTTP_400_BAD_REQUEST)


# Login
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        email = User.objects.get(username=user).email

        verified, details, account_added, services_added = check(email, user, request)

        _, token = AuthToken.objects.create(user)

        send_mail(subject='Login success!', message=f'Login successfull. You successfully Logged in', from_email=getattr(
            settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{email}"], fail_silently=False)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': token,
            'verified': verified,
            'details': details,
            'account_added': account_added,
            'services_added': services_added
        })


# password reset (if user forgets the password)
class PasswordReset(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        vercode = verificationCode()

        try:
            email = request.data['email']
            try:
                PasswordCodes.objects.filter(
                    user=User.objects.get(email=email)).delete()
            except:
                pass

            try:
                User.objects.get(email=email)
                PasswordCodes.objects.create(
                    user=User.objects.get(email=email), code=vercode)

                send_mail(subject='Password reset verification', message=f'Here is your password reset verifcation code {vercode}. If it is not you, just ignore the message.', from_email=getattr(
                    settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{email}"], fail_silently=False)

                return Response({
                    'message': 'Password Reset code sent! Check your email inbox.'
                })
            except:
                return Response({
                    'email_error': 'Please provide a registered email address.'
                }, status.HTTP_400_BAD_REQUEST)

        except:
            return Response({
                'email_error': 'Provide an email to get the verification code.'
            }, status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        try:
            try:
                code = request.data['code']
            except:
                return Response({
                    'code': 'Please enter a verification code.'
                }, status.HTTP_400_BAD_REQUEST)

            try:
                email = request.data['email']
                reg_user = User.objects.get(email=email)
            except:
                return Response({
                    'email_error': 'Please provide a registered email address.'
                }, status.HTTP_400_BAD_REQUEST)

            try:
                db_code = PasswordCodes.objects.get(user=reg_user).code
            except:
                return Response({
                    'code': 'There is no password reset code registered on this email address. Click the GET VERIFICATION CODE button to receive it again.'
                }, status.HTTP_400_BAD_REQUEST)

            if code == db_code:
                serializer = self.get_serializer(
                    reg_user, data=request.data, partial=True)

                serializer.is_valid(raise_exception=True)

                user = serializer.save()

                PasswordCodes.objects.filter(user=reg_user).delete()

                send_mail(subject='Password changed successfully!', message=f'Your password was updated successfully!',
                          from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{email}"], fail_silently=False)

                verified, details, account_added, services_added = check(email, user, request)

                _, token = AuthToken.objects.create(user)
                return Response({
                    'user': UserSerializer(user, context=self.get_serializer_context()).data,
                    'token': token,
                    'verified': verified,
                    'details': details,
                    'account_added': account_added,
                    'services_added': services_added
                })

            return Response({
                'code': 'Invalid verification code.'
            }, status.HTTP_400_BAD_REQUEST)

        except:
            return Response({
                'message': 'Please check the fields. (Check your new password).'
            }, status.HTTP_400_BAD_REQUEST)


# Account deletion
class DeleteUser(generics.DestroyAPIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

    def perform_destroy(self, instance):
        if instance == self.request.user:
            send_mail(subject='Account deletion request.', message=f'Account deletion request from your account with username {instance.username} has been approved. Your account has been deleted successfully!', from_email=getattr(
                settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f'{instance.email}'])

            return instance.delete()

        raise serializers.ValidationError(
            'You are not authorized to perform this action!')
