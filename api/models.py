from django.db import models
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class Registro(models.Model):
    nombre = models.CharField(max_length=15)
    apellido = models.CharField(max_length=15)
    correo = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=50)

class AgendarClase(models.Model):
    nombre = models.CharField(max_length=15)
    apellido = models.CharField(max_length=15)


class DatosFisicos(models.Model):
    usuario = models.ForeignKey(Registro, on_delete=models.CASCADE)
    peso = models.DecimalField(max_digits=5, decimal_places=2)
    altura = models.DecimalField(max_digits=5, decimal_places=2)
    imc = models.DecimalField(max_digits=4, decimal_places=1)
    fecha = models.DateField(auto_now_add=True)


class Coach(models.Model):
    nombre = models.CharField(max_length=15)
    apellido = models.CharField(max_length=15)
    correo = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    bibliografia = models.CharField(max_length=250)
    especialidad = models.CharField(max_length=50)

class Membresia(models.Model):
    usuario = models.ForeignKey(Registro, on_delete=models.CASCADE)
    plan_nombre = models.CharField(max_length=50)
    plan_clases = models.IntegerField()
    plan_precio = models.IntegerField()
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(blank=True, null=True)

    clases_disponibles = models.IntegerField(blank=True, null=True)

    estado = models.CharField(max_length=20, default='Pendiente')
    is_active = models.BooleanField(default=False)
    comprobante = models.ImageField(upload_to='comprobantes/', null=True, blank=True)

    def save(self, *args, **kwargs):
        # 🔹 Solo al crear la membresía
        if not self.pk:
            self.clases_disponibles = self.plan_clases

        if not self.end_date:
            self.end_date = self.start_date + timedelta(days=30)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.usuario} → {self.plan_nombre}"

    
class NuevoCoach(models.Model):
    nombre = models.CharField(max_length=15)
    apellido = models.CharField(max_length=15)
    correo = models.EmailField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    bibliografia = models.CharField(max_length=250)
    especialidad = models.CharField(max_length=50) 


class ClaseProgramada(models.Model):
    dia = models.CharField(max_length=20)
    fecha = models.DateField()
    tipo = models.CharField(max_length=50)
    horario = models.CharField(max_length=30)
    cupos_disponibles = models.IntegerField(default=20)  

    def __str__(self):
        return f"{self.dia} {self.fecha} - {self.horario}"



class Pago(models.Model):
    usuario = models.ForeignKey(Registro, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20)  
    monto = models.IntegerField()
    metodo = models.CharField(max_length=20)  
    fecha = models.DateField(auto_now_add=True)
    hora = models.TimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, default="Pendiente")  

    def __str__(self):
        return f"{self.usuario.nombre} - {self.tipo} - {self.estado}"

class ReservaClase(models.Model):
    usuario = models.ForeignKey(Registro, on_delete=models.CASCADE)
    clase = models.ForeignKey(ClaseProgramada, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, default="Pendiente")  # Pendiente, Presente, Ausente

    def __str__(self):
        return f"{self.usuario.nombre} {self.usuario.apellido} → {self.clase.tipo}"

class Asistencia(models.Model):
    clase = models.ForeignKey(ClaseProgramada, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Registro, on_delete=models.CASCADE)
    presente = models.BooleanField(default=False)
    fecha_reserva = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.nombre} en {self.clase}"