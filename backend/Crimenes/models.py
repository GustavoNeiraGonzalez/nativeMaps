# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Crimenes(models.Model):
    CrimenId = models.AutoField(primary_key=True)
    crime = models.CharField(max_length=255)
    def __str__(self):
        return self.crime
