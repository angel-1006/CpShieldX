from rest_framework import views, permissions, status
from rest_framework.response import Response
from .models import ContentItem
from .services import compute_sha256, compute_similarity
from audit.models import AuditLog
from django.core.mail import send_mail
from users.permissions import IsVerifier

class VerifyAdvancedView(views.APIView):
    permission_classes = [IsVerifier]

    def post(self, request):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"detail": "File is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Compute fingerprint
        incoming_sha = compute_sha256(file_obj)

        # Check for exact match
        try:
            item = ContentItem.objects.get(sha256=incoming_sha)
            status_str = "Copied"
            result = {
                "status": status_str,
                "owner": item.owner.username,
                "title": item.title,
                "stored_sha256": item.sha256,
                "incoming_sha256": incoming_sha,
            }

            # 🔎 Add audit log here
            AuditLog.objects.create(
                user=request.user,
                action="ORIGINALITY",
                file_name=file_obj.name,
                sha256=incoming_sha,
                result=status_str
            )

            return Response(result)

        except ContentItem.DoesNotExist:
            pass

        # Extract text (for now, assume plain text file)
        file_obj.seek(0)
        new_text = file_obj.read().decode("utf-8", errors="ignore")
        file_obj.seek(0)

        # Compare with existing texts
        existing_texts = [c.extracted_text for c in ContentItem.objects.exclude(extracted_text__isnull=True)]
        similarity_score = compute_similarity(new_text, existing_texts)

        if similarity_score > 0.8:  # threshold
            status_str = "Partially Copied / Modified"
            result = {
                "status": status_str,
                "similarity_score": round(similarity_score * 100, 2),
                "message": "Content is highly similar to existing records."
            }
        else:
            status_str = "Original"
            result = {
                "status": status_str,
                "incoming_sha256": incoming_sha,
                "similarity_score": round(similarity_score * 100, 2),
                "message": "No significant match found. Content appears unique."
            }

        # 🔎 Add audit log here (for both Partial + Original cases)
        AuditLog.objects.create(
            user=request.user,
            action="ORIGINALITY",
            file_name=file_obj.name,
            sha256=incoming_sha,
            result=status_str
        )
        if status_str in ["Copied", "Partially Copied / Modified"]:
            send_mail(
                subject="CopyShieldX Alert: Suspicious Content Detected",
                message=f"""
                User: {request.user.username}
                File: {file_obj.name}
                Status: {status_str}
                SHA256: {incoming_sha}
                """,
                from_email="your_email@gmail.com",
                recipient_list=["admin_email@gmail.com"],  # notify admin
                fail_silently=True,
            )
        return Response(result)