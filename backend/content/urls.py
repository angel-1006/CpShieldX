from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ContentItemViewSet
from .views_verify import VerifyAdvancedView

router = DefaultRouter()
router.register(r"items", ContentItemViewSet, basename="content-item")

urlpatterns = router.urls + [
    path("verify-advanced/", VerifyAdvancedView.as_view(), name="verify-advanced"),
]