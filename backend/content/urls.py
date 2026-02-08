from django.urls import path
from rest_framework.routers import DefaultRouter
from django.urls import include
from .views import *
from .views_verify import *
router = DefaultRouter()
router.register(r"items", ContentItemViewSet, basename="content-item")

urlpatterns = router.urls + [
    path("verify/", VerifyAdvancedView.as_view(), name="verify-advanced"),
    path("stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("", include(router.urls)),
    path("stats/creator/", CreatorStatsView.as_view(), name="creator-stats"),
    path("stats/admin/", AdminStatsView.as_view(), name="admin-stats"),
    path("users/systemstats/", SystemStatsView.as_view(), name="system-stats"),
]