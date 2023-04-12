from django.urls import path
from .api import UbicacionApi
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'api/comentarios', UbicacionApi)

urlpatterns = [
    path('api/createUbi/', UbicacionApi.as_view(), name='ubicaciones-create'),
]