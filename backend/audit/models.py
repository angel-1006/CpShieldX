from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ("UPLOAD", "Upload"),
        ("VERIFY", "Verify"),
        ("ORIGINALITY", "Originality Check"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    sha256 = models.CharField(max_length=64, blank=True, null=True)
    path=models.CharField(max_length=500, blank=True, null=True)
    method=models.CharField(max_length=10, blank=True, null=True)
    result = models.CharField(max_length=50, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.result} ({self.timestamp})"
    
class Alert(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Alert for {self.user.username}: {self.message[:50]}"