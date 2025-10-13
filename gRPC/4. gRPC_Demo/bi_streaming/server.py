import grpc
from concurrent import futures
import chat_pb2
import chat_pb2_grpc
import time

class ChatServicer(chat_pb2_grpc.ChatServicer):
    def StreamChat(self, request_iterator, context):
        """Handles bidirectional streaming chat.        
        This function receives messages from client and yields messages back.        
        Both operations can happen concurrently."""        
        for message in request_iterator:
            print(f"Received: {message.text}")
            # Process the message            
            response_text = f"Echo: {message.text}"            
            # Send response back to client           
            yield chat_pb2.Message(
                text=response_text,
                timestamp=int(time.time())
            )
            # Can yield multiple messages for one received message            
            # yield chat_pb2.Message(text="Another response")

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    chat_pb2_grpc.add_ChatServicer_to_server(ChatServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server started on port 50051")
    server.wait_for_termination()

if __name__ == '__main__':
    serve()