from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CrimenesSerializer
from .models import Crimenes
class CrimenesApi(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = CrimenesSerializer
    queryset = Crimenes.objects.all()

    def check_permissions(self, request):
        if request.method == 'POST':
            super().check_permissions(request)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        ubicaciones = Crimenes.objects.all()
        serializer = self.serializer_class(ubicaciones, many=True)
        return Response(serializer.data)

