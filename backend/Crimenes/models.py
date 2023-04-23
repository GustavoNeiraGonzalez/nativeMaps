# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Permission

class Crimenes(models.Model):
    CrimenId = models.AutoField(primary_key=True)
    crime = models.CharField(max_length=255)
    #con este linea devolverá solo el crimen y no el id
    def __str__(self):
        return self.crime
    
    # definir permisos
    class Meta:
        permissions = [
            ("can_create", "Can create"),
        ]
