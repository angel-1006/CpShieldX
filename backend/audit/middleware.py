class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # Remove or comment out this block if not needed
        # user = getattr(request, "user", None)
        # try:
        #     AuditLog.objects.create(
        #         user=user if user and user.is_authenticated else None,
        #         action="REQUEST",
        #         path=request.path,
        #         method=request.method,
        #     )
        # except Exception:
        #     pass
        return response