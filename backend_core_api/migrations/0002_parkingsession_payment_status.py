# Auto-generated migration for adding payment_status field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend_core_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='parkingsession',
            name='payment_status',
            field=models.CharField(
                choices=[('PENDING', 'Pending'), ('SUCCESS', 'Success'), ('FAILED', 'Failed')],
                default='PENDING',
                max_length=10
            ),
        ),
    ]
