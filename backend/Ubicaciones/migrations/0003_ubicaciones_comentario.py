# Generated by Django 4.1.7 on 2023-05-01 02:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Ubicaciones', '0002_ubicaciones_fecha_creacion'),
    ]

    operations = [
        migrations.AddField(
            model_name='ubicaciones',
            name='comentario',
            field=models.TextField(default='1 asaltante en moto'),
            preserve_default=False,
        ),
    ]
