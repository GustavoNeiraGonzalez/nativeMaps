from rest_framework.permissions import BasePermission

class CanCreateCrime(BasePermission):
    """
    Define si un usuario puede crear un crimen.
    """
    def has_permission(self, request, view):
        return request.user.has_perm('Crimenes.add_crimenes')
