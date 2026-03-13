from django.db import models


class Post(models.Model):

    post_title = models.CharField(max_length=255)

    post_description = models.TextField()

    post_image = models.ImageField(upload_to="posts/", blank=True, null=True)

    post_created_time = models.DateTimeField(auto_now_add=True)

    post_edited_time = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.post_title