# Import the signals submodule as instructed in
# https://docs.djangoproject.com/en/dev/topics/signals/#connecting-receiver-functions
# pylint: disable=import-outside-toplevel, unused-import
"""TCF Django Web Application."""

from django.apps import AppConfig


class TcfWebsiteConfig(AppConfig):
    """TCF Django Web Application Configuration."""
    name = 'tcf_website'

    def ready(self):
        import tcf_website.signals
