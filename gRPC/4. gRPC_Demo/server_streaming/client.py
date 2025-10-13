import grpc
import number_pb2
import number_pb2_grpc
def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = number_pb2_grpc.NumberServiceStub(channel)  
        # Get the stream
        stream = stub.GetNumbers(number_pb2.Range(start=1, end=5))
        # Iterate over the stream
        # This blocks and receives messages as they arrive
        for number in stream:
            print(f"Received: {number.value}")
        # Stream automatically closes when done
if __name__ == '__main__':
    run()