"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt import views as jwt_views
from UserCreate.api import userApi, check_token
urlpatterns = [
    # ...
    path('admin/', admin.site.urls),
    # checktoken sirve para ver si sirve el token al iniciar la app
    # porque cualquier peticion que necesite authenticación ya se verifica
    # el token por defecto por simplejwt
    path('checkToken', check_token),
    path('',include('Ubicaciones.urls')),
    path('',include('Crimenes.urls')),

    path('api/createUser', userApi.as_view()),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]

