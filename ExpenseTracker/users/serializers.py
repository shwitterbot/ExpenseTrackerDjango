from django.contrib.auth import password_validation
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {"write_only": True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password_1 = serializers.CharField(required=True, write_only=True)
    new_password_2 = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({'old_password': 'Неверный текущий пароль.'})
        if data['new_password_1'] != data['new_password_2']:
            raise serializers.ValidationError({'new_password_2': 'Пароли не совпадают.'})
        password_validation.validate_password(data['new_password_1'], user)
        return data
