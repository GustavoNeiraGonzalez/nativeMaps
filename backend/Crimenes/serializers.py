from rest_framework import serializers
from .models import Crimenes

class CrimenesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Crimenes
        fields = ['CrimenId', 'crime']

    def validate(self, data):
        """
        Comprueba que no exista un crimen con el mismo nombre.
        """
        crime_name = data.get('crime', None)
        if crime_name:
            existing_crime = Crimenes.objects.filter(crime=crime_name).first()
            if existing_crime:
                raise serializers.ValidationError('Ya existe un crimen con este nombre.')
        return data
