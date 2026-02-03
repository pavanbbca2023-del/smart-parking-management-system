# Generated manually to add booking_time field

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend_core_api', '0013_user_plain_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='parkingsession',
            name='booking_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='parkingsession',
            name='entry_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]