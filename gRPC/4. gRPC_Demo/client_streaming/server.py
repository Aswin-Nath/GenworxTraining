import grpc
from concurrent import futures
import accumulator_pb2
import accumulator_pb2_grpc

class AccumulatorServicer(accumulator_pb2_grpc.AccumulatorServicer):
    def Sum(self, request_iterator, context):
        """Receives a stream of numbers and returns their sum.        
        Args: request_iterator: Iterator of Number messages            
        context: RPC context        
        Returns: Total message with the sum"""        
        total = 0        
        count = 0        
        # Iterate over incoming messages        
        # This blocks waiting for each message        
        for number in request_iterator:
            total += number.value
            count += 1            
            print(f"Received number {count}: {number.value}, running total: {total}")
        # When client is done sending, return final result        
        return accumulator_pb2.Total(sum=total)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    accumulator_pb2_grpc.add_AccumulatorServicer_to_server(AccumulatorServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()    