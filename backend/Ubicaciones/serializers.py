from django.contrib.auth import get_user_model
from rest_framework import serializers, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import Ubicaciones

User = get_user_model()


class UbicacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubicaciones
        fields = ['UbiId', 'crimen', 'date', 'latitude', 'longitude', 'user']

