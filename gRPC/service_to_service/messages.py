"""
Simple gRPC service definitions for service-to-service communication demo.
This file contains the basic message classes and service stubs.
"""

import grpc
from typing import Dict, List, Any

# Message classes to replace protobuf generated classes
class GetUserRequest:
    def __init__(self, user_id: int = 0):
        self.user_id = user_id

class CreateUserRequest:
    def __init__(self, name: str = "", email: str = ""):
        self.name = name
        self.email = email

class ValidateUserRequest:
    def __init__(self, user_id: int = 0):
        self.user_id = user_id

class UserResponse:
    def __init__(self, user_id: int = 0, name: str = "", email: str = "", success: bool = False, message: str = ""):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.success = success
        self.message = message

class ValidateUserResponse:
    def __init__(self, is_valid: bool = False, message: str = ""):
        self.is_valid = is_valid
        self.message = message

class GetProductRequest:
    def __init__(self, product_id: int = 0):
        self.product_id = product_id

class CheckStockRequest:
    def __init__(self, product_id: int = 0, quantity: int = 0):
        self.product_id = product_id
        self.quantity = quantity

class UpdateStockRequest:
    def __init__(self, product_id: int = 0, quantity_change: int = 0):
        self.product_id = product_id
        self.quantity_change = quantity_change

class ListProductsRequest:
    def __init__(self):
        pass

class ProductResponse:
    def __init__(self, product_id: int = 0, name: str = "", price: float = 0.0, 
                 stock_quantity: int = 0, success: bool = False, message: str = ""):
        self.product_id = product_id
        self.name = name
        self.price = price
        self.stock_quantity = stock_quantity
        self.success = success
        self.message = message

class StockResponse:
    def __init__(self, product_id: int = 0, current_stock: int = 0, available: bool = False,
                 success: bool = False, message: str = ""):
        self.product_id = product_id
        self.current_stock = current_stock
        self.available = available
        self.success = success
        self.message = message

class ProductListResponse:
    def __init__(self, products: List[ProductResponse] = None, success: bool = False, message: str = ""):
        self.products = products or []
        self.success = success
        self.message = message

class OrderItem:
    def __init__(self, product_id: int = 0, quantity: int = 0):
        self.product_id = product_id
        self.quantity = quantity

class CreateOrderRequest:
    def __init__(self, user_id: int = 0, items: List[OrderItem] = None):
        self.user_id = user_id
        self.items = items or []

class GetOrderRequest:
    def __init__(self, order_id: int = 0):
        self.order_id = order_id

class ListUserOrdersRequest:
    def __init__(self, user_id: int = 0):
        self.user_id = user_id

class OrderResponse:
    def __init__(self, order_id: int = 0, user_id: int = 0, items: List[OrderItem] = None,
                 total_amount: float = 0.0, status: str = "", success: bool = False, message: str = ""):
        self.order_id = order_id
        self.user_id = user_id
        self.items = items or []
        self.total_amount = total_amount
        self.status = status
        self.success = success
        self.message = message

class OrderListResponse:
    def __init__(self, orders: List[OrderResponse] = None, success: bool = False, message: str = ""):
        self.orders = orders or []
        self.success = success
        self.message = message