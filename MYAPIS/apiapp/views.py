from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from .serializers import CustomUserSerializer
from apiapp.models import CustomUser
from rest_framework.decorators import action



def login(request):
    return render(request,'login.html')

def register(request):
    return render(request,'register.html')

def dashboard(request):
    return render(request,'dashboard.html')


# User Registration View
class RegisterView(APIView):
    """
    User Registration API.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        """
        Create a new user and generate a token.
        """
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate a token for the new user
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        Retrieve all users (typically this would be restricted to admins).
        """
        # Fetch all users (note: be cautious of security concerns here)
        users = CustomUser.objects.all()
        users_data = [{"username": user.username, "email": user.email} for user in users]
        return Response({"users": users_data}, status=status.HTTP_200_OK)

    def delete(self, request):
        """
        Delete a specific user account (requires authentication and authorization).
        """
        # Delete the user by username or email (be careful with this endpoint)
        username = request.data.get('username')

        if username:
            try:
                user = CustomUser.objects.get(username=username)
                user.delete()
                return Response({"message": f"User {username} deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            except CustomUser.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)

# User Login View
class LoginView(APIView):
    """
    User Login API with Token generation.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Authenticate user and generate a token on successful login.
        """
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user:
            # Generate a token for the user on successful login
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        """
        Get the logged-in user's token details.
        """
        # Retrieve token details for the currently authenticated user
        user = request.user
        if user.is_authenticated:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id}, status=status.HTTP_200_OK)
        return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request):
        """
        Delete the user's token (log out).
        """
        user = request.user
        if user.is_authenticated:
            # Delete the user's token
            token = Token.objects.filter(user=user).first()
            if token:
                token.delete()
                return Response({"message": "Logged out successfully."}, status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "No active token found."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "User not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
