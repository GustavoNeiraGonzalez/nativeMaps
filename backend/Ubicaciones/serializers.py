from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Ubicaciones
from datetime import datetime
from Crimenes.models import Crimenes 
from django.shortcuts import get_object_or_404

User = get_user_model()

class UbicacionesSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()

    class Meta:
        model = Ubicaciones
        fields = ['UbiId', 'crimen', 'date', 'latitude', 'longitude', 'user']
    def create(self, validated_data):
        user = self.context['request'].user
        crime = self.context['request'].data.get('crime')
        try:
            crimen = Crimenes.objects.get(crime=crime)
        except Crimenes.DoesNotExist:
            # Aquí puedes manejar la excepción como quieras
            # Por ejemplo, puedes devolver una respuesta de error
            raise serializers.ValidationError("No se encontró un crimen que coincida")
        ubicacion = Ubicaciones.objects.create(user=user, crimen=crimen, **validated_data)
        return ubicacion

    def validate_date(self, value):
        try:
            date = datetime.strptime(value, '%H:%M %d/%m %Y')
        except ValueError:
            raise serializers.ValidationError("La fecha no está en el formato correcto (hh:mm dd/mm yyyy)")
        return date.strftime('%Y-%m-%d %H:%M:%S')
    def get_date(self, obj):
        date = datetime.strptime(obj.date, '%Y-%m-%d %H:%M:%S')
        return date.strftime('%H:%M %d/%m %Y')
