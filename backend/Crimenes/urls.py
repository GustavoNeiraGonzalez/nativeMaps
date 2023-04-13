from django.urls import path
from .api import CrimenesApi
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'api/Crimen', CrimenesApi, basename='Crimenes')

urlpatterns = [
    path('api/Crimenes/', CrimenesApi.as_view(), name='ubicaciones-create'),
]