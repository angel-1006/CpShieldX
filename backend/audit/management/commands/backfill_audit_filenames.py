from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Backfill AuditLog.file_name from ContentItem records using sha256"

    def handle(self, *args, **options):
        from audit.models import AuditLog
        from content.models import ContentItem

        updated = 0
        for audit in AuditLog.objects.filter(file_name__isnull=True).exclude(sha256__isnull=True):
            try:
                item = ContentItem.objects.filter(sha256=audit.sha256).first()
                if item and getattr(item, "file", None):
                    audit.file_name = item.file.name
                    audit.save(update_fields=["file_name"])
                    updated += 1
            except Exception:
                continue

        self.stdout.write(self.style.SUCCESS(f"Backfilled {updated} audit records."))
