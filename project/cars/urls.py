from django.urls import path
from .views import *
urlpatterns = [
    path('', CarsListAPIView.as_view(), name = 'cars_list'),
]
