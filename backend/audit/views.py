from rest_framework import viewsets, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer
from users.permissions import IsAdmin, IsVerifier

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for audit logs.
    - Admins can see all logs
    - Verifiers can see only their own logs
    """

    serializer_class = AuditLogSerializer

    def get_queryset(self):
        user = self.request.user
        if IsAdmin().has_permission(self.request, self):  # Admins see all
            return AuditLog.objects.all().order_by("-timestamp")
        elif IsVerifier().has_permission(self.request, self):  # Verifiers see their own
            return AuditLog.objects.filter(user=user).order_by("-timestamp")
        else:
            return AuditLog.objects.none()

    permission_classes = [permissions.IsAuthenticated]