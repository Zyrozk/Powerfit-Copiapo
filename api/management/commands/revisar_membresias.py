from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail

from api.models import Membresia


class Command(BaseCommand):
    help = "Revisa membresías próximas a vencer o vencidas y envía correos"

    def handle(self, *args, **options):
        hoy = timezone.now().date()
        aviso = hoy + timedelta(days=3)

        membresias = Membresia.objects.filter(is_active=True)

        if not membresias.exists():
            self.stdout.write(self.style.WARNING("No hay membresías activas."))
            return

        for m in membresias:
            usuario = m.usuario
            correo = usuario.correo

            # 🔔 MEMBRESÍA POR VENCER
            if m.end_date == aviso:
                send_mail(
                    subject="⏰ Tu membresía está por vencer",
                    message=(
                        f"Hola {usuario.nombre},\n\n"
                        f"Te recordamos que tu membresía '{m.plan_nombre}' "
                        f"vence el día {m.end_date}.\n\n"
                        "Renueva a tiempo para no perder tus clases.\n\n"
                        "PowerFit 💚"
                    ),
                    from_email=None,
                    recipient_list=[correo],
                )

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Correo de aviso enviado a {correo} (por vencer)"
                    )
                )

            # ⛔ MEMBRESÍA VENCIDA
            elif m.end_date < hoy:
                send_mail(
                    subject="❌ Tu membresía ha vencido",
                    message=(
                        f"Hola {usuario.nombre},\n\n"
                        f"Tu membresía '{m.plan_nombre}' venció el día {m.end_date}.\n\n"
                        "Puedes renovarla cuando quieras desde la plataforma.\n\n"
                        "PowerFit 💚"
                    ),
                    from_email=None,
                    recipient_list=[correo],
                )

                m.is_active = False
                m.estado = "Vencida"
                m.save()

                self.stdout.write(
                    self.style.ERROR(
                        f"Membresía vencida y correo enviado a {correo}"
                    )
                )

        self.stdout.write(self.style.SUCCESS("✔ Revisión de membresías finalizada"))
