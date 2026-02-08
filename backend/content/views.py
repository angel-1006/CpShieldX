import hashlib
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import ContentItem
from .serializers import ContentItemSerializer
from audit.models import AuditLog
from users.permissions import IsCreator


class IsOwner(permissions.BasePermission):
    """Ensure only the owner can access their own content items."""
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class ContentItemViewSet(viewsets.ModelViewSet):
    serializer_class = ContentItemSerializer
    permission_classes = [IsCreator]

    def get_queryset(self):
        return ContentItem.objects.filter(owner=self.request.user).order_by("-created_at")
    def perform_create(self, serializer):
        # Save file with owner
        serializer.save(owner=self.request.user)
        item = serializer.instance

        from .services import compute_similarity
        from django.utils import timezone

        incoming_sha = item.sha256

        # Upload log first
        AuditLog.objects.create(
            user=self.request.user,
            action="UPLOAD",
            file_name=item.file.name,
            sha256=incoming_sha,
            result="Uploaded",
            timestamp=timezone.now()
        )
        
        # Exact match check
        try:
            existing = ContentItem.objects.exclude(id=item.id).get(sha256=incoming_sha)
            item.status = "Rejected"
            item.save()

            AuditLog.objects.create(
                user=self.request.user,
                action="ORIGINALITY",
                file_name=item.file.name,
                sha256=incoming_sha,
                result="Copied",
                timestamp=timezone.now()
            )
            return
        except ContentItem.DoesNotExist:
            pass

        # Similarity check
        new_text = item.extracted_text or ""
        existing_texts = [
            c.extracted_text for c in ContentItem.objects.exclude(extracted_text__isnull=True).exclude(id=item.id)
        ]
        similarity_score = compute_similarity(new_text, existing_texts)

        if similarity_score > 0.8:
            item.status = "Rejected"
            result_str = "Partially Copied / Modified"
        else:
            item.status = "Approved"
            result_str = "Original"

        item.save()

        # Originality log
        AuditLog.objects.create(
            user=self.request.user,
            action="ORIGINALITY",
            file_name=item.file.name,
            sha256=incoming_sha,
            result=result_str,
            timestamp=timezone.now()
        )
class DashboardStatsView(APIView):
    """
    Returns real-time statistics for the verifier dashboard:
    - Verified Files (Original)
    - Duplicates Found (Copied / Partially Copied)
    - Pending Reviews
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        verified_count = AuditLog.objects.filter(result="Original").count()
        duplicates_count = AuditLog.objects.filter(
            result__in=["Copied", "Partially Copied / Modified"]
        ).count()
        pending_count = ContentItem.objects.filter(status="Pending").count()

        return Response({
            "verified_files": verified_count,
            "duplicates_found": duplicates_count,
            "pending_reviews": pending_count,
        }, status=status.HTTP_200_OK)


class CreatorStatsView(APIView):
    """
    Returns statistics for the creator dashboard:
    - Pending files
    - Approved files
    - Rejected files
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pending_count = ContentItem.objects.filter(owner=request.user, status="Pending").count()
        approved_count = ContentItem.objects.filter(owner=request.user, status="Approved").count()
        rejected_count = ContentItem.objects.filter(owner=request.user, status="Rejected").count()

        return Response({
            "pending": pending_count,
            "approved": approved_count,
            "rejected": rejected_count,
        }, status=status.HTTP_200_OK)
class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_uploads = AuditLog.objects.filter(action="UPLOAD").count()
        originals = AuditLog.objects.filter(result="Original").count()
        copies = AuditLog.objects.filter(result="Copied").count()
        modified = AuditLog.objects.filter(result="Partially Copied / Modified").count()
        pending = ContentItem.objects.filter(status="Pending").count()

        return Response({
            "total_uploads": total_uploads,
            "originals": originals,
            "copies": copies,
            "modified": modified,
            "pending_reviews": pending,
        }, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsAdmin
from audit.models import AuditLog
from content.models import ContentItem
from users.models import User
class SystemStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_users = User.objects.count()
        creators = User.objects.filter(role="CREATOR").count()
        verifiers = User.objects.filter(role="VERIFIER").count()
        admins = User.objects.filter(role="ADMIN").count()

        total_uploads = AuditLog.objects.filter(action="UPLOAD").count()
        originals = AuditLog.objects.filter(result="Original").count()
        copies = AuditLog.objects.filter(result="Copied").count()
        modified = AuditLog.objects.filter(result="Partially Copied / Modified").count()
        pending = ContentItem.objects.filter(status="Pending").count()

        return Response({
            "total_users": total_users,
            "creators": creators,
            "verifiers": verifiers,
            "admins": admins,
            "total_uploads": total_uploads,
            "originals": originals,
            "copies": copies,
            "modified": modified,
            "pending_reviews": pending,
        }, status=status.HTTP_200_OK)