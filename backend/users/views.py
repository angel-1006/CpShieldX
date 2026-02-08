from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

# -------------------------
# Current User Profile View
# -------------------------
class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# -------------------------
# Register Serializer
# -------------------------
class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]  # include role

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            role=validated_data["role"]  # default role if not provided
        )
        return user


# -------------------------
# Register View
# -------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

from rest_framework import generics, permissions
from users.models import User
from users.serializers import UserSerializer
from users.permissions import IsAdmin

class ManageUsersUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

from rest_framework import generics
from users.models import User
from users.serializers import UserSerializer
from users.permissions import IsAdmin

class ManageUsersListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("username")
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]