from rest_framework import viewsets, permissions
from .models import ContentItem
from .serializers import ContentItemSerializer
from audit.models import AuditLog
from users.permissions import IsCreator

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class ContentItemViewSet(viewsets.ModelViewSet):
    serializer_class = ContentItemSerializer
    permission_classes = [IsCreator]

    def get_queryset(self):
        return ContentItem.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        AuditLog.objects.create(
            user=self.request.user,
            action="UPLOAD",
            file_name=serializer.validated_data["file"].name,
            sha256=serializer.instance.sha256,
            result="Uploaded"
        )
