from django.contrib import admin
from .models import AgendarClase, DatosFisicos, Registro, Coach, Membresia

# Register your models here.

class agendarClaseAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido']

admin.site.register(AgendarClase)

class datosFisicosAdmin(admin.ModelAdmin):
    list_display = ['peso', 'altura']

admin.site.register(DatosFisicos)

class registroAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido', 'correo', 'password']

admin.site.register(Registro)

class coachAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido', 'correo', 'password', 'bibliografia', 'especialiad']

admin.site.register(Coach)

class membresiaAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'plan_nombre', 'plan_clases', 'plan_precio', 'start_date', 'end_date', 'is_active']

admin.site.register(Membresia, membresiaAdmin)