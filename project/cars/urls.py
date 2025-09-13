from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    # #For Api
    path("api/cars/", CarsListAPIView.as_view()),
    path("api/cars/<int:pk>/", CarDetailAPIView.as_view()),
    path("api/rent_car/", RentCarAPIView.as_view()),
    path("api/post_car/", CarCreateAPIView.as_view()),
    # path("api/my_cars/", UsersCarsAPIView.as_view())

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
