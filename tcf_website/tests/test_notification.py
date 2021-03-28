# pylint: disable=no-member

"""Tests for Notification model."""

from django.test import TestCase
from django.urls import reverse

from ..models import Notification
from .test_utils import setup, suppress_request_warnings


class NotificationTests(TestCase):
    """Tests for the Notification model"""

    def setUp(self):
        setup(self)
        # Send a notification to user1
        self.notification1 = Notification.objects.create(
            user=self.user1,
            type=Notification.Type.REVIEW_UPVOTED,
            content='Someone likes your review!',
        )

    @suppress_request_warnings
    def test_mark_one_as_read_different_user(self):
        """Test if mark_one_as_read works fails for a different user"""
        # user2 tries to mark the user1's notification as read
        self.client.force_login(self.user2)
        response = self.client.post(
            reverse('mark_one_as_read', args=(self.notification1.id,)))
        self.assertEqual(response.status_code, 403)

    @suppress_request_warnings
    def test_mark_one_as_read_valid(self):
        """Test if mark_one_as_read works correctly for valid requests"""
        self.client.force_login(self.user1)
        response = self.client.post(
            reverse('mark_one_as_read', args=(self.notification1.id,)))
        self.notification1.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.notification1.is_read)

    @suppress_request_warnings
    def test_mark_all_as_read_valid(self):
        """Test if mark_all_as_read works correctly"""
        # Send another notification to user1
        notification2 = Notification.objects.create(
            user=self.user1,
            type=Notification.Type.REVIEW_UPVOTED,
            content='Another person likes your review!',
        )
        self.client.force_login(self.user1)
        response = self.client.post(reverse('mark_all_as_read'))
        self.assertEqual(response.status_code, 200)
        for notification in [self.notification1, notification2]:
            notification.refresh_from_db()
            self.assertTrue(notification.is_read)
