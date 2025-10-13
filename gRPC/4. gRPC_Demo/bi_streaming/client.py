import grpc
import time
import chat_pb2
import chat_pb2_grpc

def generate_messages():
    """Generator that yields messages to send."""    
    messages = ["Hello", "How are you?", "Goodbye"]
    for msg in messages:
        time.sleep(1)  
        # Delay between messages        
        print(f"Sending: {msg}")
        yield chat_pb2.Message(text=msg, timestamp=int(time.time()))

def run():
    with grpc.insecure_channel('localhost:50051') as channel:
        # Start the bidirectional stream
        stub = chat_pb2_grpc.ChatStub(channel)
        response_iterator = stub.StreamChat(generate_messages())
        # Receive messages from server
        # This blocks until server closes the stream
        for response in response_iterator:
            print(f"Received: {response.text} at {response.timestamp}")

if __name__ == '__main__':
    run()   

