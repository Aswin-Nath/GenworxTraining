import grpc
import hello_pb2
import hello_pb2_grpc
def run():
    """Runs the gRPC client."""    
    # Create a channel (connection) to the server    
    # Using 'with' ensures the channel is properly closed    
    with grpc.insecure_channel('localhost:50051') as channel:
        # Create a stub (client) from the channel        
        # The stub has methods that correspond to service RPCs        
        stub = hello_pb2_grpc.GreeterStub(channel)
        # Create a request message       
        request = hello_pb2.HelloRequest(name="World")
        # Make the RPC call        
        # This blocks until the server responds (or timeout occurs)        
        response = stub.SayHello(request)
        # Access the response data        
        print(f"Response: {response.message}")
if __name__ == '__main__':
    run()