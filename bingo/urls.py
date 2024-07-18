from django.urls import path

from . import views

urlpatterns = [
    # ex: /bingo - Main Bingo Page
    path("", views.index, name="index"),
    # ex: /bingo/number - Number Detail Page
    #path("<int:number>/", views.number, name="number"),
    # ex: /bingo/api/datanumbers/ - API Data - GET all picked numbers - POST pick a number
    path("api/data/numbers/", views.bingo_numbers_data, name='bingo_numbers_data'),
    # ex: /bingo/api/data/numbers/$number - API Data - GET number detail/object
    path("api/data/numbers/<int:number>/", views.bingo_object, name='bingo_object'),
]
