# Generated by Django 3.2.2 on 2021-05-30 04:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='barberdetails',
            name='about',
            field=models.CharField(blank=True, max_length=1000, verbose_name='about'),
        ),
        migrations.AlterField(
            model_name='barberdetails',
            name='employee_count',
            field=models.PositiveIntegerField(verbose_name='employee_count'),
        ),
        migrations.AlterField(
            model_name='barberdetails',
            name='id',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL, verbose_name='id'),
        ),
        migrations.AlterField(
            model_name='barberdetails',
            name='image',
            field=models.ImageField(blank=True, upload_to='images/', verbose_name='image'),
        ),
        migrations.AlterField(
            model_name='barberdetails',
            name='location',
            field=models.CharField(max_length=200, verbose_name='location'),
        ),
        migrations.AlterField(
            model_name='barberdetails',
            name='website',
            field=models.URLField(blank=True, verbose_name='website'),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='about',
            field=models.CharField(blank=True, max_length=1000, verbose_name='about'),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='id',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL, verbose_name='id'),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='image',
            field=models.ImageField(upload_to='images/', verbose_name='image'),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='location',
            field=models.CharField(max_length=200, verbose_name='location'),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='website',
            field=models.URLField(blank=True, verbose_name='website'),
        ),
    ]
