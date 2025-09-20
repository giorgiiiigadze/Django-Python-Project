from rest_framework import generics, permissions
from .models import *
from .serializers import *
from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings


class CarsListAPIView(APIView):
    def get(self, request):

        cars = self.get_queryset() 
        serializer = CarSerializer(cars, many=True)

        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = Car.objects.all()
        brand = self.request.query_params.get('brand')
        model = self.request.query_params.get('model')
        is_available = self.request.query_params.get('is_available')

        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        if model:
            queryset = queryset.filter(model__icontains=model)
        if is_available in ['true', 'false']:
            queryset = queryset.filter(is_available=(is_available == 'true'))

        return queryset
    
    def post(self, request):
        serializer = CarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def patch(self, request):
        car_id = request.data.get("car_id")

        if not car_id:
            return Response({"error": "car id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        car = get_object_or_404(Car, id = car_id)
        user = request.user

        if user in car.liked_by.all():
            car.liked_by.remove(user)
            message = "Car unliked"
        else:
            car.liked_by.add(user)
            message = "Car liked"

        return Response(
            {
                "message": message,
                "car": car.id,
                "likes_count": car.liked_by.count()
            },
            status=status.HTTP_200_OK
        )

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
            car = serializer.save(owner=request.user, is_available=True)

            send_mail(
                subject="Car Posted Successfully",
                message=f"Hi {request.user.username}, your car '{car.brand} {car.model}' "
                        f"has been posted successfully and is now available for rent.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=False,
            )


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

    def post(self, request, pk):
        user = request.user
        days = request.data.get("days", 1)

        try:
            days = int(days)
            if days < 1:
                raise ValueError
        except ValueError:
            return Response({"error": "Days must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST)

        car = get_object_or_404(Car, pk=pk)

        if not car.is_available:
            return Response({"error": "This car is not available for rent."}, status=status.HTTP_400_BAD_REQUEST)

        total_price = car.daily_price * days

        rent_car = RentCar.objects.create(
            user=user,
            car=car,
            days=days,
            total_price=total_price
        )

        car.rent_count += 1
        car.is_available = False
        car.rented_by = user
        car.save()

        send_mail(
            subject="Car Rental Confirmation",
            message=(
                f"Hi {user.username},\n\n"
                f"You have successfully rented '{car.brand} {car.model}' for {days} days.\n"
                f"Total Price: {total_price}$\n\n"
                f"Thank you for choosing our service!"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        data = {
            "message": "Car rented successfully!",
            "rental": {
                "user": user.username,
                "car": f"{car.brand} {car.model}",
                "days": rent_car.days,
                "total_price": rent_car.total_price
            }
        }
        return Response(data, status=status.HTTP_201_CREATED)


class MyLikedCarsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        liked_cars = Car.objects.filter(liked_by=request.user)
        serializer = CarSerializer(liked_cars, many=True, context={"request": request})
        
        return Response(
            {"count": liked_cars.count(), "results": serializer.data},
            status=status.HTTP_200_OK
        )