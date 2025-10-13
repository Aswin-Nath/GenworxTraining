# Service-to-Service Communication with gRPC Demo

This demo showcases **service-to-service communication** using gRPC with Python. It demonstrates a microservices architecture where services communicate with each other to fulfill business operations.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Service  │    │ Inventory Svc   │    │  Order Service  │
│   Port: 50051   │    │   Port: 50052   │    │   Port: 50053   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   CLI Client    │
                    │  (Demo Client)  │
                    └─────────────────┘
```

## Services

### 1. User Service (Port 50051)
- Manages user data and authentication
- Operations: GetUser, CreateUser, ValidateUser
- Sample users: Alice Johnson, Bob Smith, Charlie Brown

### 2. Inventory Service (Port 50052)
- Manages product inventory and stock
- Operations: GetProduct, CheckStock, UpdateStock, ListProducts
- Sample products: Laptop, Mouse, Keyboard, Monitor, Headphones

### 3. Order Service (Port 50053)
- Manages orders and orchestrates other services
- **Demonstrates Service-to-Service Communication**
- Operations: CreateOrder, GetOrder, ListUserOrders

## Service-to-Service Communication Flow

When creating an order, the Order Service communicates with other services:

1. **Order Service → User Service**: Validate that the user exists
2. **Order Service → Inventory Service**: Get product details and prices
3. **Order Service → Inventory Service**: Check stock availability
4. **Order Service → Inventory Service**: Reserve stock (update quantities)
5. **Order Service → Client**: Return order confirmation

## Files Structure

```
service_to_service/
├── services.proto          # Protocol buffer definitions
├── messages.py            # Python message classes (replaces protobuf)
├── user_service.py        # User service implementation
├── inventory_service.py   # Inventory service implementation  
├── order_service.py       # Order service with inter-service calls
├── cli_client.py          # Interactive CLI client for testing
├── start_demo.bat         # Windows startup script
├── start_demo.sh          # Linux/Mac startup script
└── README.md             # This file
```

## Prerequisites

Install required Python packages:
```bash
pip install grpcio
```

## Running the Demo

### Option 1: Automatic Start (Recommended)

**Windows:**
```cmd
start_demo.bat
```

**Linux/Mac:**
```bash
chmod +x start_demo.sh
./start_demo.sh
```

### Option 2: Manual Start

1. **Start User Service:**
```bash
python user_service.py
```

2. **Start Inventory Service:**
```bash
python inventory_service.py
```

3. **Start Order Service:**
```bash
python order_service.py
```

4. **Run CLI Client:**
```bash
python cli_client.py
```

## Demo Features

### Interactive CLI Menu
- Test individual services
- Demonstrate service-to-service communication
- View service architecture
- See real-time communication flow

### Key Demonstrations

1. **User Management**: Create and validate users
2. **Inventory Management**: Check products and stock levels
3. **Order Processing**: Create orders that trigger multiple service calls
4. **Service Communication**: See how Order Service calls User and Inventory services
5. **Error Handling**: Handle cases like invalid users or insufficient stock

## Example Service Communication

When creating an order for User 1 with 2 Laptops and 1 Mouse:

```
CLI Client → Order Service: CreateOrder(user_id=1, items=[...])
  ↓
Order Service → User Service: ValidateUser(user_id=1)
  ← User Service: User is valid (Alice Johnson)
  ↓
Order Service → Inventory Service: GetProduct(product_id=101)
  ← Inventory Service: Laptop, $999.99
  ↓
Order Service → Inventory Service: CheckStock(product_id=101, quantity=2)
  ← Inventory Service: Stock available (50 >= 2)
  ↓
Order Service → Inventory Service: UpdateStock(product_id=101, quantity_change=-2)
  ← Inventory Service: Stock updated (48 remaining)
  ↓
Order Service → CLI Client: Order created successfully! Total: $2029.97
```

## Learning Objectives

- Understand microservices architecture
- Learn gRPC service-to-service communication
- See how services orchestrate business operations
- Practice error handling in distributed systems
- Experience CLI-based service interaction

## Next Steps

- Implement actual gRPC protobuf generation
- Add authentication and security
- Implement circuit breakers and retry logic
- Add distributed tracing and monitoring
- Scale services with load balancing

## Troubleshooting

**Services won't start:**
- Check if ports 50051, 50052, 50053 are available
- Install grpcio: `pip install grpcio`

**Connection errors:**
- Make sure all services are running before starting the client
- Check Windows Firewall or antivirus blocking connections

**Import errors:**
- Make sure all files are in the same directory
- Run commands from the service_to_service directory

## Notes

This demo uses simplified message classes instead of generated protobuf stubs to focus on the service communication patterns rather than protobuf complexity. In production, you would use proper protobuf generation with `grpc_tools.protoc`.