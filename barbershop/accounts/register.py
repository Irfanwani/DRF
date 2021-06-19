from rest_framework import generics, permissions
from rest_framework.response import Response

from knox.models import AuthToken
from .serializers import RegistrationSerializer, UserSerializer, LoginSerializer
from .models import Emails, PasswordCodes, SignUpCodes

from django.core.mail import send_mail
from django.contrib.auth.models import User

from django.conf import settings

# code generator
import random


def verificationCode():
    return random.randint(10000, 99999)


# Registration
class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        print(user)

        # verification code creation and send to the user email
        verCode = verificationCode()

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

    def post(self, request):
        code = request.data['code']

        try:
            Emails.objects.get(user=User.objects.get(
                username=request.user.username))
            return Response({
                'verified': 'verified',
                'message': 'Email already verified'
            })
        except:
            if code == SignUpCodes.objects.get(user=User.objects.get(username=request.user.username)).code:
                Emails.objects.create(user=User.objects.get(
                    username=request.user.username), email=User.objects.get(username=request.user.username).email)
                SignUpCodes.objects.get(user=User.objects.get(
                    username=request.user.username)).delete()

                send_mail(subject='Registration success!', message=f'Registration successfull. You successfully registered', from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{request.user.email}"], fail_silently=False)

                return Response({
                    'verified': 'verified',
                    'message': 'Email address verified! Registration completed!'
                })

            return Response({
                'verified': 'not verified',
                'message': 'Please provide a valid verification code.'
            })


# Login
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)

        send_mail(subject='Login success!', message=f'Login successfull. You successfully Logged in', from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{request.user.email}"], fail_silently=False)

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': token
        })


# password reset (if user forgets the password)
class PasswordReset(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        vercode = verificationCode()

        try:
            email = request.data['email']
            try:
                PasswordCodes.objects.filter(user=User.objects.get(email=email)).delete()
            except:
                pass

            try:
                User.objects.get(email=email)
                PasswordCodes.objects.create(user=User.objects.get(email=email), code=vercode)

                send_mail(subject='Password reset verification', message=f'Here is your password reset verifcation code {vercode}. If it is not you, just ignore the message.', from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{email}"], fail_silently=False)

                return Response({
                    'message': 'Password Reset code sent! Check your email inbox.'
                })
            except:
                return Response({
                    'message': 'Please provide a registered email address.'
                })

        except:
            return Response({
                'message': 'Provide an email to get the verification code.'
            })


    def put(self, request):
        try:
            try:
                code = request.data['code']
            except:
                return Response({
                    'message': 'Please enter a verification code.'
                })

            try:
                email = request.data['email']
                reg_user = User.objects.get(email=email)
            except:
                return Response({
                    'message': 'Please provide a registered email address.'
                })

            db_code = PasswordCodes.objects.get(user=reg_user).code
            
            if code == db_code:
                print('codes are same')
                serializer = self.get_serializer(reg_user, data=request.data, partial=True)

                serializer.is_valid(raise_exception=True)

                user = serializer.save()

                PasswordCodes.objects.get(user=reg_user).delete()

                send_mail(subject='Password changed successfully!', message=f'Your password was updated successfully!', from_email=getattr(settings, 'DEFAULT_FROM_EMAIL'), recipient_list=[f"{email}"], fail_silently=False)

                _, token = AuthToken.objects.create(user)
                return Response({
                    'user': UserSerializer(user, context=self.get_serializer_context()).data,
                    'token': token
                })

            return Response({
                'message': 'Invalid verification code.'
            })

        except:
            return Response({
                'message': 'Please check the fields.'
            })





