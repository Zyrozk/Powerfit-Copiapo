from rest_framework import serializers
from .models import AgendarClase, DatosFisicos, Registro, Coach, Membresia, NuevoCoach, ClaseProgramada, Pago, Asistencia
from django.core.exceptions import ValidationError
from django.utils import timezone

class agendarClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgendarClase
        fields = '__all__'


class datosFisicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatosFisicos
        fields = '__all__'


class registroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro
        fields = '__all__'

    def validate_correo(self, value):
        if Registro.objects.filter(correo=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value


class coachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = '__all__'

    def validate_correo(self, value):
        if Coach.objects.filter(correo=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value


class membresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = '__all__'

    def validate(self, data):
        usuario = data.get('usuario')
        if usuario:
            # Verificar si el usuario ya tiene una membresía activa
            membresia_activa = Membresia.objects.filter(
                usuario=usuario,
                is_active=True,
                end_date__gte=timezone.now().date()
            ).exists()
            if membresia_activa:
                raise serializers.ValidationError("El usuario ya tiene una membresía activa. No puede adquirir otra hasta que expire.")
        return data


class nuevoCoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = NuevoCoach
        fields = '__all__'

    def validate_correo(self, value):
        if NuevoCoach.objects.filter(correo=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value


class claseProgramadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaseProgramada
        fields = '__all__'


class pagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'


class AsistenciaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    usuario_apellido = serializers.CharField(source='usuario.apellido', read_only=True)

    class Meta:
        model = Asistencia
        fields = '__all__'