from django.contrib import admin
from .models import Car

@admin.action(description="Mark selected cars as not available")
def make_not_available(modeladmin, request, queryset):
    queryset.update(is_available=False)

@admin.action(description="Mark selected cars as available")
def make_available(modeladmin, request, queryset):
    queryset.update(is_available=True)

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ("id", "brand","model","city","daily_price","is_available","rent_count","owner", "likes_count", "rented_by", )
    list_filter = ("brand","city","is_available","transmission","year",)
    search_fields = ("brand", "model", "license_plate", "owner__username")
    actions = [make_not_available, make_available]
    
    #Fucntion for counting likes
    def likes_count(self, obj):
        return obj.liked_by.count()

