# pylint: disable=no-member
"""Tests for Review model."""
from django.test import TestCase

from ..models import Notification, Vote
from .test_utils import setup


class SignalTests(TestCase):
    """Tests for signals.py"""

    def setUp(self):
        setup(self)

    def test_notify_upon_review_upvote_for_updated_upvote(self):
        """Test if notify_upon_review_upvote doesn't create a new Notification
        correctly when an existing upvote instance is updated"""
        self.upvote_review1_2.user = self.user4
        self.upvote_review1_2.save()
        # The most recent notification should be user2's. (See test_utils.)
        self.assertEqual(Notification.objects.first().user, self.user2)

    def test_notify_upon_review_upvote_for_new_upvote(self):
        """Test if notify_upon_review_upvote creates a new Notification
        correctly when a new upvote is created"""
        Vote.objects.create(
            value=1,
            user=self.user4,
            review=self.review1,
        )
        # The most recent notification should now be user4's.
        self.assertEqual(Notification.objects.first().user, self.user4)

    def test_notify_upon_review_upvote_for_new_downvote(self):
        """Test if notify_upon_review_upvote creates a new Notification
        correctly when a new downvote is created"""
        Vote.objects.create(
            value=-1,
            user=self.user4,
            review=self.review1,
        )
        # The most recent notification should now be user4's.
        self.assertEqual(Notification.objects.first().user, self.user2)
