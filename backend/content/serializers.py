from rest_framework import serializers
from .models import ContentItem

class ContentItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentItem
        fields = ["id", "title", "file", "sha256", "created_at"]
        read_only_fields = ["sha256", "created_at"]