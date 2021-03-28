#pylint: disable=unused-argument
"""Django signals to implement the observer pattern"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse

from .models import Notification, Vote


@receiver(post_save, sender=Vote,
          dispatch_uid='notify user upon review upvote')
def notify_upon_review_upvote(sender, instance: Vote, created: bool,
                              **kwargs):
    """A signal that sends a notification when a user's review is upvoted."""
    # TODO: disallow notification for their own upvote
    if instance.value < 0 or not created:
        return
    mnemonic = instance.review.course.subdepartment.mnemonic
    number = instance.review.course.number
    content = (f'Someone upvoted your review for {mnemonic} {number}. Thanks '
               'for writing a helpful review!')
    # appreciation: "Thanks for writing a helpful review!"
    # call to action: "They will appreciate it if you could write more reviews!"
    Notification.objects.create(
        user=instance.user,
        type=Notification.Type.REVIEW_UPVOTED,
        is_read=False,
        content=content,
        mime_type=Notification.MimeType.PLAIN,
        title='',
        next_path=f"{reverse('reviews')}?review_id={instance.review.id}"
    )
