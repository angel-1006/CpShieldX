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