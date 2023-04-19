from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Ubicaciones
from datetime import datetime
from Crimenes.models import Crimenes 
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from dateutil import parser
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()

class UbicacionesSerializer(serializers.ModelSerializer):
    date = serializers.CharField()
    crimen = serializers.CharField()

    class Meta:
        model = Ubicaciones
        fields = ['UbiId', 'crimen', 'date', 'latitude', 'longitude', 'user','fecha_creacion']
        read_only_fields = ['user', 'date', 'fecha_creacion']  # Agregar user a los campos de solo lectura

    def create(self, validated_data):
        # Obtener el usuario autenticado actualmente
        try:
            user, payload = JWTAuthentication().authenticate(self.context['request'])
        except:
            raise serializers.ValidationError('No se ha proporcionado una clave de autenticación o es incorrecta.')
        print(user.id)
        print('ola')
        validated_data['user'] = user

        crime_name = validated_data.pop('crimen')
        try:
            crime_instance = Crimenes.objects.get(crime=crime_name)
        except Crimenes.DoesNotExist:
            raise serializers.ValidationError("No se encontró un crimen que coincida")

        validated_data['crimen'] = crime_instance  # Asignar la instancia de Crimenes recuperada al campo 'crimen'
        # Verificar si el usuario ya ha creado una ubicación hoy
        today = timezone.now().date()
        try:
            ubicacion = Ubicaciones.objects.filter(user=user, fecha_creacion__date=today)
            raise serializers.ValidationError('Ya has creado una ubicación hoy.')
        except ObjectDoesNotExist:
            pass
        # Validar la fecha
        date = validated_data.pop('date')
        try:
            date = datetime.strptime(date, '%H:%M %d/%m %Y')
        except ValueError:
            raise serializers.ValidationError("La fecha no está en el formato correcto (hh:mm dd/mm yyyy)")
        validated_data['date'] = date

        ubicacion = Ubicaciones.objects.create(**validated_data)
        return ubicacion




    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if 'date' in representation:
            date = parser.parse(representation['date'])
            representation['date'] = date.strftime('%H:%M %d/%m/%Y')
        user = instance.user
        representation['user'] = {'id': user.id, 'username': user.username}         
        return representation
