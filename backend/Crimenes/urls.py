from django.urls import path
from .api import CrimenesApi, CreateCrimeApi, DeleteCrimeApi
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'api/Crimenes/get', CrimenesApi, basename='Crimenes')

urlpatterns = [
    path('api/Crimenes/', CreateCrimeApi.as_view(), name='crimenes-create'),
    path('api/Crimenes/get/', CrimenesApi.as_view(), name='crimenes-get'),
    path('api/Crimenes/<int:pk>/', DeleteCrimeApi.as_view(), name='crimenes-delete'),
]