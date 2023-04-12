from django.urls import path
from .api import UbicacionApi
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'api/Ubicaciones', UbicacionApi , basename='ubicacion')

urlpatterns = [
    path('api/createUbi/', UbicacionApi.as_view()),
]