import grpc
import hello_pb2
import hello_pb2_grpc

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = hello_pb2_grpc.GreeterStub(channel)
        try:
            # Try to make an RPC call            
            response = stub.SayHello(hello_pb2.HelloRequest(name="MyName"))
            print(f"Response: {response.message}")
        except grpc.RpcError as e:
            # All gRPC errors raise RpcError            
            print(f"RPC failed!")
            print(f"Status code: {e.code()}")          
            # e.g., StatusCode.INVALID_ARGUMENT            
            print(f"Error details: {e.details()}")     
            # Human-readable message            
            print(f"Debug string: {e.debug_error_string()}")  
            # Detailed debug info            
            # # Get trailing metadata            
            trailing_metadata = dict(e.trailing_metadata())
            if 'error-code' in trailing_metadata:
                print(f"Error code: {trailing_metadata['error-code']}")
            # Handle specific error codes            
            if e.code() == grpc.StatusCode.INVALID_ARGUMENT:
                print("Please provide valid input")
            elif e.code() == grpc.StatusCode.PERMISSION_DENIED:
                print("You don't have permission")
            elif e.code() == grpc.StatusCode.UNAVAILABLE:
                print("Service is down, retrying...")
                # Implement retry logic            
            else:
                print(f"Unexpected error: {e.code().name}")

if __name__ == '__main__':
    run()