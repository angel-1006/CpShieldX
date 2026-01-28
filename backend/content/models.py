import hashlib
from django.db import models
from django.conf import settings

from .services import extract_text_from_file

def upload_to(instance, filename):
    return f"uploads/{instance.owner_id}/{filename}"

class ContentItem(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="contents")
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=upload_to)
    sha256 = models.CharField(max_length=64, editable=False)
    extracted_text = models.TextField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Compute SHA-256 when saving
        if self.file and not self.sha256:
            self.file.seek(0)
            sha = hashlib.sha256(self.file.read()).hexdigest()
            self.sha256 = sha
            self.file.seek(0)
        if self.file and not self.extracted_text:
            self.extracted_text = extract_text_from_file(self.file, self.file.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.owner.username})"