from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CrimenesSerializer
from .models import Crimenes
from django.core.exceptions import PermissionDenied
from .permissions import CanCreateCrime


class CrimenesApi(APIView):
    permission_classes = [IsAuthenticated,CanCreateCrime]
    serializer_class = CrimenesSerializer
    queryset = Crimenes.objects.all()

    def check_permissions(self, request):
        if request.method == 'POST':
            super().check_permissions(request)

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied:
            return Response({'error': 'No tienes permiso para crear crímenes.'}, status=status.HTTP_403_FORBIDDEN)

    def get(self, request):
        ubicaciones = Crimenes.objects.all()
        serializer = self.serializer_class(ubicaciones, many=True)
        return Response(serializer.data)
    def delete(self, request, pk):
        try:
            crimenes = Crimenes.objects.get(pk=pk)
        except Crimenes.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        crimenes.delete()
        message = {'message': 'La entrada ha sido eliminada exitosamente.'}
        return Response(message, status=status.HTTP_200_OK)
