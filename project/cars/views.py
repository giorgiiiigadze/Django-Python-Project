from rest_framework import generics, permissions
from .models import *
from .serializers import *
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class CarsListAPIView(APIView):
    def get(self, request):
        cars = Car.objects.all()
        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class CarDetailAPIView(generics.RetrieveAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "pk"

class CarCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = CarSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(
                {"message": "Car created successfully!","data": serializer.data},
                status=status.HTTP_201_CREATED
                )
        return Response(
            {"message": "Validation failed","errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
            )

class RentCarAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        rented_cars = RentCar.objects.filter(user=request.user)
        serializer = RentCarSerialazer(rented_cars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    

    def post(self, request):
        user = request.user
        car_id = request.data.get("car_id")
        days = request.data.get("days", 1)

        if not car_id:
            return Response({"error": "Car ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            days = int(days)
            if days < 1:
                raise ValueError
        except ValueError:
            return Response({"error": "Days must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST)

        car = get_object_or_404(Car, id=car_id)

        if not car.is_available:
            return Response({"error": "This car is not available for rent."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = car.daily_price * days
        
        rent = RentCar.objects.create(
            user=user,
            car=car,
            days=days,
            total_price=total_price
        )
        car.rent_count += 1
        car.is_available = False
        car.save()

        data = {
            "message": "Car rented successfully!",
            "rental": {
                "user": user.username,
                "car": f"{car.brand} {car.model}",
                "days": rent.days,
                "total_price": rent.total_price
            }
        }
        return Response(data, status=status.HTTP_201_CREATED)
    
# class UsersCarsAPIView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         cars = CustomUser.objects.filter(owner=request.user)

#         serializer = RentCarSerialazer(cars, many=True, context={"request": request})
#         return Response(serializer.data, status=status.HTTP_200_OK)