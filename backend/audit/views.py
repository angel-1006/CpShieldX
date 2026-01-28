from rest_framework import viewsets, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer
from users.permissions import IsAdmin
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by("-timestamp")
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]  # only admins can view logs