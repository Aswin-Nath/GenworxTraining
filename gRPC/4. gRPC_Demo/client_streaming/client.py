import time
import grpc
import accumulator_pb2
import accumulator_pb2_grpc

def generate_numbers():
    """Generator function that yields Number messages.    
    Client can generate messages on-the-fly without storing them all. """    
    for i in range(1, 6):
        print(f"Sending: {i}")
        yield accumulator_pb2.Number(value=i)
        # Optional: Add delay between sends        
        time.sleep(0.5)
def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        # Make the RPC call with the generator
        stub = accumulator_pb2_grpc.AccumulatorStub(channel)
        print("Starting client streaming RPC...")
        response = stub.Sum(generate_numbers())
        print(f"Final sum: {response.sum}")
if __name__ == '__main__':
    run()   

