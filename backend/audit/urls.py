from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet

router = DefaultRouter()
router.register(r"logs", AuditLogViewSet, basename="audit-log")

urlpatterns = router.urls
from django.urls import path
from .views_timeline import FootprintTimelineView
urlpatterns = router.urls

urlpatterns += [
    path("timeline/", FootprintTimelineView.as_view(), name="footprint-timeline"),
]
