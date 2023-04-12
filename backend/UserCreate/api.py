from rest_framework import permissions, status
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User    
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

class userApi(APIView):
    #--Esto es para obtener los nombres de usuario en un get
    #def get(self, request, user_id):
        # Obtener el objeto User que quieres enviar
    #    user = User.objects.get(id=user_id)

        # Crear un diccionario con solo el valor del campo username
    #    data = {'username': user.username}

        # Enviar la respuesta con los datos del usuario
    #    return Response(data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            serializer.send_verification_email(request, user)
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def check_token(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    print(f'Token: {token}') # Imprime el valor del token
    if token:
        try:
            # Verifica si el token es válido utilizando la clase JWTAuthentication
            jwt = JWTAuthentication()
            validated_token = jwt.get_validated_token(token.split()[1])
            print(f'Validated token: {validated_token}') # Imprime el token validado
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            print(f'Error: {e}') # Imprime el error si ocurre una excepción
            pass
    return Response(status=status.HTTP_401_UNAUTHORIZED)