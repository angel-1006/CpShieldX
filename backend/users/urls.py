from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("register/", RegisterView.as_view(), name="register"),
     path("adminusers/<int:pk>/", ManageUsersUpdateView.as_view(), name="manage-users-update"),
    path("adminusers/", ManageUsersListView.as_view(), name="manage-users-list"),

]