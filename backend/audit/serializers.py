from rest_framework import serializers
from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditLog
        fields = ["id", "user", "action", "file_name", "sha256", "result", "timestamp"]

    def get_file_name(self, obj):
        # Prefer explicit file_name stored in the log
        if obj.file_name:
            return obj.file_name

        # Fallback: try to resolve from ContentItem
        if obj.sha256:
            try:
                from content.models import ContentItem
                item = ContentItem.objects.filter(sha256=obj.sha256).first()
                if item and getattr(item, "file", None):
                    return item.file.name
            except Exception:
                pass

        return "Unnamed File"