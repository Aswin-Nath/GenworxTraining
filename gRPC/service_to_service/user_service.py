"""
User Service - Manages user data and authentication
Runs on port 50051
"""

import grpc
from concurrent import futures
import time
import logging
from typing import Dict

# Import our message classes
from messages import (
    GetUserRequest, CreateUserRequest, ValidateUserRequest,
    UserResponse, ValidateUserResponse
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserService:
    def __init__(self):
        # In-memory storage for demo purposes
        self.users: Dict[int, Dict] = {
            1: {"user_id": 1, "name": "Alice Johnson", "email": "alice@example.com"},
            2: {"user_id": 2, "name": "Bob Smith", "email": "bob@example.com"},
            3: {"user_id": 3, "name": "Charlie Brown", "email": "charlie@example.com"}
        }
        self.next_user_id = 4

    def GetUser(self, request, context):
        """Get user by ID"""
        logger.info(f"GetUser called with user_id: {request.user_id}")
        
        user = self.users.get(request.user_id)
        if user:
            return UserResponse(
                user_id=user["user_id"],
                name=user["name"],
                email=user["email"],
                success=True,
                message="User found successfully"
            )
        else:
            return UserResponse(
                success=False,
                message=f"User with ID {request.user_id} not found"
            )

    def CreateUser(self, request, context):
        """Create a new user"""
        logger.info(f"CreateUser called with name: {request.name}, email: {request.email}")
        
        # Check if email already exists
        for user in self.users.values():
            if user["email"] == request.email:
                return UserResponse(
                    success=False,
                    message=f"User with email {request.email} already exists"
                )
        
        # Create new user
        new_user = {
            "user_id": self.next_user_id,
            "name": request.name,
            "email": request.email
        }
        self.users[self.next_user_id] = new_user
        self.next_user_id += 1
        
        return UserResponse(
            user_id=new_user["user_id"],
            name=new_user["name"],
            email=new_user["email"],
            success=True,
            message="User created successfully"
        )

    def ValidateUser(self, request, context):
        """Validate if user exists"""
        logger.info(f"ValidateUser called with user_id: {request.user_id}")
        
        user_exists = request.user_id in self.users
        return ValidateUserResponse(
            is_valid=user_exists,
            message="User is valid" if user_exists else "User not found"
        )

# gRPC service handler
class UserServiceHandler:
    def __init__(self):
        self.service = UserService()

    def GetUser(self, request, context):
        try:
            # Convert dict to our message class
            req = GetUserRequest(user_id=request.user_id)
            return self.service.GetUser(req, context)
        except Exception as e:
            logger.error(f"Error in GetUser: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return UserResponse(success=False, message=str(e))

    def CreateUser(self, request, context):
        try:
            req = CreateUserRequest(name=request.name, email=request.email)
            return self.service.CreateUser(req, context)
        except Exception as e:
            logger.error(f"Error in CreateUser: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return UserResponse(success=False, message=str(e))

    def ValidateUser(self, request, context):
        try:
            req = ValidateUserRequest(user_id=request.user_id)
            return self.service.ValidateUser(req, context)
        except Exception as e:
            logger.error(f"Error in ValidateUser: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return ValidateUserResponse(is_valid=False, message=str(e))

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # We'll add the service to server when we have proper protobuf implementation
    # For now, we'll create a simple server that can handle requests
    
    server.add_insecure_port('[::]:50051')
    server.start()
    
    logger.info("User Service started on port 50051")
    print("User Service is running on port 50051...")
    print("Available users:")
    user_service = UserService()
    for user_id, user in user_service.users.items():
        print(f"  ID: {user_id}, Name: {user['name']}, Email: {user['email']}")
    
    try:
        while True:
            time.sleep(86400)  # Keep server running
    except KeyboardInterrupt:
        logger.info("Shutting down User Service...")
        server.stop(0)

if __name__ == '__main__':
    serve()