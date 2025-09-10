from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from users.models import CustomUser
# Create your models here.

class Car(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posted_cars')
    brand = models.CharField(max_length=50, unique=False)
    model = models.CharField(max_length=50)
    year = models.IntegerField(default=2025)
    daily_price = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    capacity = models.IntegerField()
    transmission = models.CharField(max_length=20, choices=[
        ('automatic', 'Automatic'),
        ('manual', 'Manual'),
        ('tiptronic', 'Tiptronic'),
    ], default='automatic')
    city = models.CharField(max_length=50, default='kutaisi')
    fuel_tank = models.IntegerField(default=1)
    
    photo1 = models.ImageField(upload_to='cars/', default='cars/default1.jpg')
    photo2 = models.ImageField(upload_to='cars/', default='cars/default2.jpg')
    photo3 = models.ImageField(upload_to='cars/', default='cars/default3.jpg')
    
    license_plate = models.CharField(max_length=20, unique=True)

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.brand} {self.model} {self.year}"

class RentCar(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    days = models.IntegerField(default=1)
    
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.user} renter the {self.car.brand} {self.car.model}'
