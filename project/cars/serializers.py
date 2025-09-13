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

    def validate_brand(self, value):
        allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -"
        for char in value:
            if char not in allowed_chars:
                raise serializers.ValidationError(
                    "Brand can only contain letters, numbers, spaces, and hyphens."
                )
        if not value.strip():
            raise serializers.ValidationError("Brand cannot be empty")
        return value
    
    def validate_model(self, value):
        allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 -."
        for char in value:
            if char not in allowed_chars:
                raise serializers.ValidationError(
                    "Model can only contain letters, numbers, spaces, hyphens, and dots."
                )
        if not value.strip():
            raise serializers.ValidationError("Model cannot be empty")
        return value

class RentCarSerialazer(serializers.ModelSerializer):
    class Meta:
        model = RentCar
        fields = ["id", "user", "car", "days", "total_price"]
        read_only_fields = ["user", "total_price"]