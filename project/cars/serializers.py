from rest_framework import serializers
from .models import *
# from django.contrib.auth.models import User


class CarSerializer(serializers.ModelSerializer):

    class Meta:
        model = Car
        fields = [
            'id',
            'owner', 'brand', 'model', 'year', 'capacity', 
            'transmission', 'daily_price', 'city', 
            'photo1', 'photo2', 'photo3', 'license_plate' ,'is_available'
        ]
        read_only_fields = ['id','owner']

class RentCarSerialazer(serializers.ModelSerializer):
    class Meta:
        model = RentCar
        fields = ["id", "user", "car", "days", "total_price"]
        read_only_fields = ["user", "total_price"]