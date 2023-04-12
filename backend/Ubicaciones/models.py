from django.db import models
from django.contrib.auth.models import User
from .models import Crimenes

class Ubicaciones(models.Model):
    crimen = models.ForeignKey(Crimenes, on_delete=models.CASCADE)
    date = models.DateTimeField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
