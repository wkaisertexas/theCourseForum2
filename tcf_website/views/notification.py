# pylint: disable=unused-argument
"""Views dealing with Notifcation model across various pages"""
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.generic.base import View
from django.views.decorators.csrf import csrf_exempt

from ..models import Notification


@method_decorator(csrf_exempt, name='dispatch')
class MarkOneAsUnreadView(View):
    """Marks a notification as unread"""
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        """Mark the notification with the given `notification_id` as unread in
        an idempotent manner. Can raise Http404 and PermissionDenied."""
        notification = get_object_or_404(
            Notification, pk=kwargs.get('notification_id'))
        if notification.user != request.user:
            raise PermissionDenied(
                'You are not allowed to mark this notification as unread.')
        notification.is_read = False
        notification.save()
        return HttpResponse(f"Notification with ID {kwargs['notification_id']}"
                            " marked as unread.")


@method_decorator(csrf_exempt, name='dispatch')
class MarkOneAsReadView(View):
    """Marks a notification as read"""
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        """Mark the notification with the given `notification_id` as read in an
        idempotent manner. Can raise Http404 and PermissionDenied."""
        notification = get_object_or_404(
            Notification, pk=kwargs.get('notification_id'))
        if notification.user != request.user:
            raise PermissionDenied(
                'You are not allowed to mark this notification as read.')
        notification.is_read = True
        notification.save()
        return HttpResponse(f"Notification with ID {kwargs['notification_id']}"
                            " marked as read.")


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class MarkAllAsReadView(View):
    """Marks all notifications of the user as read"""
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        """Mark all of the user's notifications as read in an idempotent
        manner."""
        Notification.objects.filter(user=request.user).update(is_read=True)
        return HttpResponse('Marked all as read!')
