import grpc
import hello_pb2
import hello_pb2_grpc
from concurrent import futures

class GreeterServicer(hello_pb2_grpc.GreeterServicer):
    def SayHello(self, request, context):
        """Handles SayHello with comprehensive error handling."""        
        # Validate input        
        if not request.name:
            # Set error status and details            
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            context.set_details('Name cannot be empty')
            # Return empty response (client won't see it due to error)            
            return hello_pb2.HelloReply()
        # Check for specific invalid values        
        if request.name.lower() == 'admin':
            context.set_code(grpc.StatusCode.PERMISSION_DENIED)
            context.set_details('Cannot greet admin users')
            return hello_pb2.HelloReply()
        # Simulate resource not found        
        if request.name == 'ghost':
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f'User "{request.name}" not found')
            return hello_pb2.HelloReply()
        # Check if client cancelled (deadline exceeded)        
        if not context.is_active():
            return hello_pb2.HelloReply()
        # Success case        
        return hello_pb2.HelloReply(message=f"Hello, {request.name}!")

def serve():
    """Starts the gRPC server."""    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    hello_pb2_grpc.add_GreeterServicer_to_server(GreeterServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()