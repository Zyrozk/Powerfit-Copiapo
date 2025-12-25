from django.contrib import admin
from django.urls import path
from api import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # Registro y datos personales
    path('agendarClase/', views.agendarClase_list),
    path('datosFisico/', views.datosFisicos_list),
    path("datosFisicos/<int:user_id>/", views.datosFisicos_usuario),
    path('registro/', views.registro_list),
    path('registro/<int:pk>/', views.registro_list),

    # Coaches
    path('coach/', views.coach_list),
    path("coaches/", views.coach_list),
    path("coaches/<int:coach_id>/", views.coach_detail),

    # Membresías
    path('membresia/', views.membresia_list),
    path('comprar-membresia/', views.comprar_membresia_list),
    path('coach/membresias/', views.listar_todas_membresias),
    path('coach/aprobar-membresia/<int:membresia_id>/', views.aprobar_membresia),
    path('membresia/eliminar/<int:membresia_id>/', views.eliminar_membresia),
    path("membresia-activa/<int:user_id>/", views.membresia_activa),

    # Login
    path('login/', views.login_usuario),

    # Horario
    path("horario/", views.horario_list),
    path("horario/<int:pk>/", views.horario_delete),
    path("historial-uso/<int:user_id>/", views.historial_uso),


    # CLASES DEL DÍA (solo una ruta)
    path("clases-hoy/", views.clases_de_dia),

    # Inscritos y asistencia
    path("inscritos/<int:clase_id>/", views.asistentes_clase),
    path("asistentes/<int:clase_id>/", views.asistentes_clase),
    path("asistencia/<int:reserva_id>/", views.marcar_presente),
    path("asistencia/qr/<int:clase_id>/", views.registrar_asistencia_qr),
    path("asistentes/<int:clase_id>/", views.asistentes_por_clase),

    # Reservas
    path("reservar-clase/", views.reservar_clase),
    path("reservar-clase/<int:clase_id>/", views.reservar_clase),
    path("mis-reservas/<int:user_id>/", views.mis_reservas),
    path("clases-hoy/", views.clases_hoy),
    path("confirmar-asistencia/", views.confirmar_asistencia),
    path("clases-por-fecha/", views.clases_por_fecha),

    # Pagos
    path("pagos/", views.pagos_list, name="pagos_list"),
    path("pagos/exportar/", views.exportar_pagos, name="exportar_pagos"),
    path("mis-pagos/<int:user_id>/", views.mis_pagos),

    # Estadísticas
    path("estadisticas/membresias/", views.estadisticas_membresias),
    path("estadisticas/asistencia/", views.estadisticas_asistencia),
    path("estadisticas/pagos/", views.estadisticas_pagos),

    path("qr/<int:clase_id>/", views.generar_qr),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
