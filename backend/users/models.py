from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("CREATOR", "Creator"),
        ("VERIFIER", "Verifier"),
        ("ADMIN", "Admin"),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="CREATOR")

    def __str__(self):
        return f"{self.username} ({self.role})"

    def save(self, *args, **kwargs):
        # Ensure ADMIN role users are treated as Django superusers
        if self.role == "ADMIN":
            self.is_staff = True
            self.is_superuser = True
        else:
            # Optional: reset flags for non-admins
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)