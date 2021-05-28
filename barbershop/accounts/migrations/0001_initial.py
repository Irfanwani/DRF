# Generated by Django 3.2.2 on 2021-05-25 04:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='BarberDetails',
            fields=[
                ('id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('employee_count', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='UserDetails',
            fields=[
                ('id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
            ],
        ),
    ]



# Use to create postgis extension when migrate command is run
""" from django.contrib.postgres.operations import CreateExtension
from django.db import migrations

class Migration(migrations.Migration):
    operations = [
        CreateExtension('postgis')
    ] """