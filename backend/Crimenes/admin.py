from django.contrib import admin
from .models import Crimenes
from django.contrib.auth.models import Permission

admin.site.register(Crimenes)
admin.site.register(Permission)
