import grpc
from concurrent import futures
import hello_pb2
import hello_pb2_grpc
class GreeterServicer(hello_pb2_grpc.GreeterServicer):
    """Implementation of the Greeter service."""    
    def SayHello(self, request, context):
        """ Handles the SayHello RPC call.        
        Args: request: HelloRequest message from the client            
        context: RPC context with metadata, deadlines, etc.        
        Returns: HelloReply message to send back to client """        
        print(f"Received request from: {request.name}")
        # Access the request data        
        name = request.name
        # Create and return a response        
        return hello_pb2.HelloReply(message=f"Hello, {name}!")
def serve():
    """Starts the gRPC server."""    
    # Create a gRPC server with a thread pool    
    # max_workers: Maximum number of threads to handle concurrent requests    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    # Register our service implementation with the server    
    hello_pb2_grpc.add_GreeterServicer_to_server(GreeterServicer(), server)
    # Tell the server to listen on port 50051    
    # '[::]:50051' means "listen on all network interfaces, port 50051"    
    # 'insecure' means no TLS/SSL (only use in development!)    
    server.add_insecure_port('[::]:50051')
    # Start the server (non-blocking)    
    server.start()
    print("Server started on port 50051")
    # Block until server is terminated (Ctrl+C)    
    server.wait_for_termination()
if __name__ == '__main__':
    serve()