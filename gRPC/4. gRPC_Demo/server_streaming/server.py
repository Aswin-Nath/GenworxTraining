import time
import grpc
from concurrent import futures
import number_pb2
import number_pb2_grpc
class NumberServicer(number_pb2_grpc.NumberServiceServicer):
    def GetNumbers(self, request, context):
        """Streams numbers from start to end.        
        The 'yield' keyword makes this a generator function.        
        Each yield sends one message to the client."""        
        for i in range(request.start, request.end + 1):
            # Check if client cancelled the request            
            if context.is_active():
                yield number_pb2.Number(value=i)
                # Optional: Add delay to simulate work                
                time.sleep(0.1)            
            else:
                # Client disconnected, stop streaming                
                return
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    number_pb2_grpc.add_NumberServiceServicer_to_server(NumberServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()
if __name__ == '__main__':
    serve()