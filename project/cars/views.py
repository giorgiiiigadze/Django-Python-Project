# cars/views.py
from rest_framework import generics, permissions
from .models import Car
from .serializers import CarSerializer

class CarsListAPIView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]
    # def perform_create(self, serializer):
    #     serializer.save(owner = self.request.user)
