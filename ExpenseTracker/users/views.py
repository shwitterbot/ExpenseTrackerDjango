from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import UserSerializer, ChangePasswordSerializer
from rest_framework.generics import CreateAPIView

class RegisterApi(CreateAPIView):
    serializer_class = UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    @action(
        detail=False,
        methods=['post'],
        url_path='change_password',
    )
    def change_password(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password_1'])
        request.user.save()
        update_session_auth_hash(request, request.user)
        return Response({'detail': 'Пароль успешно установлен'}, status=status.HTTP_200_OK)
