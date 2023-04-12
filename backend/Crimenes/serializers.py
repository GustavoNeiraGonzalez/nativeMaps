from rest_framework import serializers
from .models import Crimenes

class CrimenesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Crimenes
        fields = ['CrimenId', 'crime']
