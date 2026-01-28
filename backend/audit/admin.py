from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "user", "method", "path", "action")
    list_filter = ("method",)
    search_fields = ("path", "user__username")