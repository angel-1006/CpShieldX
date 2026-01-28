from rest_framework import views, permissions
from rest_framework.response import Response
from .models import AuditLog
from .serializers import AuditLogSerializer

class FootprintTimelineView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Get all logs for this user
        logs = AuditLog.objects.filter(user=request.user).order_by("-timestamp")
        serializer = AuditLogSerializer(logs, many=True)
        return Response({
            "user": request.user.username,
            "digital_footprints": serializer.data
        })