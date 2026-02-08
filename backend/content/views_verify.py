from rest_framework import views, status
from rest_framework.response import Response
from django.utils import timezone
from django.core.mail import send_mail

from .models import ContentItem
from .services import compute_sha256, compute_similarity
from audit.models import AuditLog
from users.permissions import IsVerifier


class VerifyAdvancedView(views.APIView):
    permission_classes = [IsVerifier]

    def post(self, request):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"detail": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Compute fingerprint
        incoming_sha = compute_sha256(file_obj)
        verified_at = timezone.now().isoformat()

        # === Case 1: Exact match (same SHA256) ===
        try:
            item = ContentItem.objects.get(sha256=incoming_sha)
            status_str = "Copied"
            result = {
                "status": status_str,
                "title": item.title,
                "owner": item.owner.username,
                "sha256": incoming_sha,
                "verified_at": verified_at,
            }

            # Update ContentItem status -> Rejected
            item.status = "Rejected"
            item.save()

            file_name = item.file.name if item else file_obj.name

            # Audit log for verifier
            AuditLog.objects.create(
                user=request.user,
                action="ORIGINALITY",
                file_name=file_name,
                sha256=incoming_sha,
                result=status_str,
                timestamp=timezone.now()
            )

            # Audit log for creator
            AuditLog.objects.create(
                user=item.owner,
                action="ORIGINALITY",
                file_name=file_name,
                sha256=incoming_sha,
                result=status_str,
                timestamp=timezone.now()
            )

            # Notify admin
            send_mail(
                subject="CopyShieldX Alert: Copied Content Detected",
                message=f"""
                Verifier: {request.user.username}
                Creator: {item.owner.username}
                File: {file_name}
                Status: {status_str}
                SHA256: {incoming_sha}
                """,
                from_email="your_email@gmail.com",
                recipient_list=["admin_email@gmail.com"],
                fail_silently=True,
            )

            return Response(result, status=status.HTTP_200_OK)

        except ContentItem.DoesNotExist:
            pass

        # === Case 2: Similarity check ===
        file_obj.seek(0)
        new_text = file_obj.read().decode("utf-8", errors="ignore")
        file_obj.seek(0)

        existing_texts = [
            c.extracted_text for c in ContentItem.objects.exclude(extracted_text__isnull=True)
        ]
        similarity_score = compute_similarity(new_text, existing_texts)

        if similarity_score > 0.8:  # threshold
            status_str = "Partially Copied / Modified"
            final_status = "Rejected"
            message = "Content is highly similar to existing records."
        else:
            status_str = "Original"
            final_status = "Approved"
            message = "No significant match found. Content appears unique."

        result = {
            "status": status_str,
            "title": file_obj.name,
            "sha256": incoming_sha,
            "similarity_score": round(similarity_score * 100, 2),
            "message": message,
            "verified_at": verified_at,
        }

        # Update ContentItem if it exists
        item = ContentItem.objects.filter(sha256=incoming_sha).first()
        if item:
            item.status = final_status
            item.save()

            file_name = item.file.name
        else:
            file_name = file_obj.name

        # Audit log for verifier
        AuditLog.objects.create(
            user=request.user,
            action="ORIGINALITY",
            file_name=file_name,
            sha256=incoming_sha,
            result=status_str,
            timestamp=timezone.now()
        )

        # Audit log for creator (if item exists)
        if item:
            AuditLog.objects.create(
                user=item.owner,
                action="ORIGINALITY",
                file_name=file_name,
                sha256=incoming_sha,
                result=status_str,
                timestamp=timezone.now()
            )

        # Notify admin if suspicious
        if final_status == "Rejected":
            send_mail(
                subject="CopyShieldX Alert: Suspicious Content Detected",
                message=f"""
                Verifier: {request.user.username}
                Creator: {item.owner.username if item else "Unknown"}
                File: {file_name}
                Status: {status_str}
                SHA256: {incoming_sha}
                """,
                from_email="your_email@gmail.com",
                recipient_list=["admin_email@gmail.com"],
                fail_silently=True,
            )

        return Response(result, status=status.HTTP_200_OK)