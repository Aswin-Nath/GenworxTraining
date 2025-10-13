"""
Order Service - Manages orders and coordinates with other services
Runs on port 50053
This service demonstrates service-to-service communication by calling User Service and Inventory Service
"""

import grpc
from concurrent import futures
import time
import logging
from typing import Dict, List
import threading

# Import our message classes
from messages import (
    CreateOrderRequest, GetOrderRequest, ListUserOrdersRequest,
    OrderResponse, OrderListResponse, OrderItem,
    # For calling other services
    GetUserRequest, UserResponse, ValidateUserRequest, ValidateUserResponse,
    GetProductRequest, ProductResponse, CheckStockRequest, StockResponse, UpdateStockRequest
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OrderService:
    def __init__(self):
        # In-memory storage for demo purposes
        self.orders: Dict[int, Dict] = {}
        self.next_order_id = 1001
        self.lock = threading.Lock()
        
        # gRPC clients for other services
        self.user_service_channel = None
        self.inventory_service_channel = None
        self.user_service_stub = None
        self.inventory_service_stub = None
        
        self._setup_service_clients()

    def _setup_service_clients(self):
        """Setup gRPC clients for other services"""
        try:
            # User Service client
            self.user_service_channel = grpc.insecure_channel('localhost:50051')
            logger.info("Connected to User Service on localhost:50051")
            
            # Inventory Service client  
            self.inventory_service_channel = grpc.insecure_channel('localhost:50052')
            logger.info("Connected to Inventory Service on localhost:50052")
            
        except Exception as e:
            logger.error(f"Failed to setup service clients: {e}")

    def _call_user_service_validate(self, user_id: int) -> bool:
        """Call User Service to validate user exists"""
        try:
            # For demo purposes, we'll simulate the call
            # In real implementation, you would use the actual gRPC stub
            logger.info(f"Calling User Service to validate user_id: {user_id}")
            
            # Simulate service call - in reality this would be:
            # request = ValidateUserRequest(user_id=user_id)
            # response = self.user_service_stub.ValidateUser(request)
            # return response.is_valid
            
            # For demo, assume users 1, 2, 3 exist
            valid_users = [1, 2, 3]
            is_valid = user_id in valid_users
            logger.info(f"User validation result for user_id {user_id}: {is_valid}")
            return is_valid
            
        except Exception as e:
            logger.error(f"Error calling User Service: {e}")
            return False

    def _call_inventory_service_check_stock(self, product_id: int, quantity: int) -> tuple:
        """Call Inventory Service to check stock availability"""
        try:
            logger.info(f"Calling Inventory Service to check stock for product_id: {product_id}, quantity: {quantity}")
            
            # Simulate service call
            # In reality: response = self.inventory_service_stub.CheckStock(request)
            
            # For demo, simulate some products and stock levels
            products_stock = {101: 50, 102: 100, 103: 75, 104: 25, 105: 60}
            
            if product_id not in products_stock:
                return False, f"Product {product_id} not found", 0
            
            current_stock = products_stock[product_id]
            available = current_stock >= quantity
            
            logger.info(f"Stock check result for product_id {product_id}: available={available}, stock={current_stock}")
            return available, "Stock check completed", current_stock
            
        except Exception as e:
            logger.error(f"Error calling Inventory Service: {e}")
            return False, str(e), 0

    def _call_inventory_service_update_stock(self, product_id: int, quantity_change: int) -> bool:
        """Call Inventory Service to update stock"""
        try:
            logger.info(f"Calling Inventory Service to update stock for product_id: {product_id}, change: {quantity_change}")
            
            # Simulate service call
            # In reality: response = self.inventory_service_stub.UpdateStock(request)
            
            # For demo, always return success
            logger.info(f"Stock updated successfully for product_id {product_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error calling Inventory Service: {e}")
            return False

    def _call_inventory_service_get_product(self, product_id: int) -> tuple:
        """Call Inventory Service to get product details"""
        try:
            logger.info(f"Calling Inventory Service to get product details for product_id: {product_id}")
            
            # Simulate service call
            products = {
                101: {"name": "Laptop", "price": 999.99},
                102: {"name": "Mouse", "price": 29.99},
                103: {"name": "Keyboard", "price": 79.99},
                104: {"name": "Monitor", "price": 299.99},
                105: {"name": "Headphones", "price": 149.99}
            }
            
            if product_id in products:
                product = products[product_id]
                return True, product["name"], product["price"]
            else:
                return False, "Product not found", 0.0
                
        except Exception as e:
            logger.error(f"Error calling Inventory Service: {e}")
            return False, str(e), 0.0

    def CreateOrder(self, request, context):
        """Create a new order with service-to-service communication"""
        logger.info(f"CreateOrder called with user_id: {request.user_id}, items: {len(request.items)}")
        
        with self.lock:
            # Step 1: Validate user exists (call User Service)
            if not self._call_user_service_validate(request.user_id):
                return OrderResponse(
                    success=False,
                    message=f"User with ID {request.user_id} does not exist"
                )
            
            # Step 2: Validate products and check stock (call Inventory Service)
            total_amount = 0.0
            validated_items = []
            
            for item in request.items:
                # Check if product exists and get details
                product_exists, product_name, product_price = self._call_inventory_service_get_product(item.product_id)
                if not product_exists:
                    return OrderResponse(
                        success=False,
                        message=f"Product with ID {item.product_id} does not exist"
                    )
                
                # Check stock availability
                stock_available, message, current_stock = self._call_inventory_service_check_stock(item.product_id, item.quantity)
                if not stock_available:
                    return OrderResponse(
                        success=False,
                        message=f"Insufficient stock for product {product_name}. Available: {current_stock}, Requested: {item.quantity}"
                    )
                
                validated_items.append({
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "product_name": product_name,
                    "unit_price": product_price
                })
                total_amount += product_price * item.quantity
            
            # Step 3: Reserve stock (call Inventory Service to update stock)
            for item in validated_items:
                # Reduce stock by the ordered quantity (negative quantity_change)
                stock_updated = self._call_inventory_service_update_stock(item["product_id"], -item["quantity"])
                if not stock_updated:
                    # In a real system, you'd implement rollback mechanism here
                    logger.warning(f"Failed to update stock for product {item['product_id']}")
            
            # Step 4: Create the order
            order_id = self.next_order_id
            self.next_order_id += 1
            
            order = {
                "order_id": order_id,
                "user_id": request.user_id,
                "items": [{"product_id": item["product_id"], "quantity": item["quantity"]} for item in validated_items],
                "total_amount": total_amount,
                "status": "confirmed",
                "timestamp": time.time()
            }
            
            self.orders[order_id] = order
            
            # Convert items back to OrderItem objects
            order_items = [OrderItem(product_id=item["product_id"], quantity=item["quantity"]) for item in validated_items]
            
            logger.info(f"Order {order_id} created successfully for user {request.user_id}")
            return OrderResponse(
                order_id=order_id,
                user_id=request.user_id,
                items=order_items,
                total_amount=total_amount,
                status="confirmed",
                success=True,
                message=f"Order created successfully. Total: ${total_amount:.2f}"
            )

    def GetOrder(self, request, context):
        """Get order details by ID"""
        logger.info(f"GetOrder called with order_id: {request.order_id}")
        
        order = self.orders.get(request.order_id)
        if order:
            order_items = [OrderItem(product_id=item["product_id"], quantity=item["quantity"]) for item in order["items"]]
            return OrderResponse(
                order_id=order["order_id"],
                user_id=order["user_id"],
                items=order_items,
                total_amount=order["total_amount"],
                status=order["status"],
                success=True,
                message="Order found successfully"
            )
        else:
            return OrderResponse(
                success=False,
                message=f"Order with ID {request.order_id} not found"
            )

    def ListUserOrders(self, request, context):
        """List all orders for a specific user"""
        logger.info(f"ListUserOrders called with user_id: {request.user_id}")
        
        user_orders = []
        for order in self.orders.values():
            if order["user_id"] == request.user_id:
                order_items = [OrderItem(product_id=item["product_id"], quantity=item["quantity"]) for item in order["items"]]
                user_orders.append(OrderResponse(
                    order_id=order["order_id"],
                    user_id=order["user_id"],
                    items=order_items,
                    total_amount=order["total_amount"],
                    status=order["status"],
                    success=True,
                    message="Order loaded"
                ))
        
        return OrderListResponse(
            orders=user_orders,
            success=True,
            message=f"Found {len(user_orders)} orders for user {request.user_id}"
        )

# gRPC service handler
class OrderServiceHandler:
    def __init__(self):
        self.service = OrderService()

    def CreateOrder(self, request, context):
        try:
            req = CreateOrderRequest(
                user_id=request.user_id,
                items=[OrderItem(product_id=item.product_id, quantity=item.quantity) for item in request.items]
            )
            return self.service.CreateOrder(req, context)
        except Exception as e:
            logger.error(f"Error in CreateOrder: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return OrderResponse(success=False, message=str(e))

    def GetOrder(self, request, context):
        try:
            req = GetOrderRequest(order_id=request.order_id)
            return self.service.GetOrder(req, context)
        except Exception as e:
            logger.error(f"Error in GetOrder: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return OrderResponse(success=False, message=str(e))

    def ListUserOrders(self, request, context):
        try:
            req = ListUserOrdersRequest(user_id=request.user_id)
            return self.service.ListUserOrders(req, context)
        except Exception as e:
            logger.error(f"Error in ListUserOrders: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return OrderListResponse(success=False, message=str(e))

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # We'll add the service to server when we have proper protobuf implementation
    # For now, we'll create a simple server that can handle requests
    
    server.add_insecure_port('[::]:50053')
    server.start()
    
    logger.info("Order Service started on port 50053")
    print("Order Service is running on port 50053...")
    print("This service communicates with:")
    print("  - User Service (localhost:50051) for user validation")
    print("  - Inventory Service (localhost:50052) for stock management")
    print("Make sure both services are running before creating orders!")
    
    try:
        while True:
            time.sleep(86400)  # Keep server running
    except KeyboardInterrupt:
        logger.info("Shutting down Order Service...")
        server.stop(0)

if __name__ == '__main__':
    serve()