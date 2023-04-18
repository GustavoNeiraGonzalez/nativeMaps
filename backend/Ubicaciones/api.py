from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UbicacionesSerializer
from .models import Ubicaciones
class UbicacionApi(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = UbicacionesSerializer
    queryset = Ubicaciones.objects.all()
    
    def check_permissions(self, request):
        if request.method == 'POST':
            super().check_permissions(request)

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            ubicacion = serializer.save()
            ubicacion_serializer = self.serializer_class(ubicacion)
            ubicacion_data = ubicacion_serializer.data
            return Response(ubicacion_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        ubicaciones = Ubicaciones.objects.all()
        serializer = self.serializer_class(ubicaciones, many=True)
        return Response(serializer.data)

