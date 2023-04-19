from django.contrib.auth import get_user_model
from rest_framework import serializers, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        instance = User()
        instance.username = validated_data.get('username')
        instance.email = validated_data.get('email')
        instance.set_password(validated_data.get('password'))
        instance.save()
        return instance
    
    def validate_username(self,data):
        users = User.objects.filter(username = data)
        if len(users) != 0:
            raise serializers.ValidationError("Este nombre de usuario ya existe, ingrese uno nuevo")
        else:
            return data

    def validate_email_format(self,email):
        try:
            validate_email(email)
            return email
        except ValidationError:
            return False

    def validate_password(self,password):
        if len(password) < 5:
            raise serializers.ValidationError("Esta contraseña debe tener un largo de 5 caracteres")
        if not any(char.islower() for char in password):
            raise serializers.ValidationError("Esta contraseña debe tener almenos 1 letra en minuscula")
        if not any(char.isupper() for char in password):
            raise serializers.ValidationError("Esta contraseña debe tener almenos 1 letra en mayuscula")
        return password


    def send_verification_email(self, request, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_url = request.build_absolute_uri(f'/verify-email/{uid}/{token}/')
        subject = 'Verifica tu dirección de correo electrónico'
        message = f'Por favor, haz clic en el siguiente enlace para verificar tu dirección de correo electrónico: {verification_url}'
        send_mail(subject, message, 'no-reply@example.com', [user.email])

