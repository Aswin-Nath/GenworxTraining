"""
Inventory Service - Manages product inventory
Runs on port 50052
"""

import grpc
from concurrent import futures
import time
import logging
from typing import Dict

# Import our message classes
from messages import (
    GetProductRequest, CheckStockRequest, UpdateStockRequest, ListProductsRequest,
    ProductResponse, StockResponse, ProductListResponse
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InventoryService:
    def __init__(self):
        # In-memory storage for demo purposes
        self.products: Dict[int, Dict] = {
            101: {"product_id": 101, "name": "Laptop", "price": 999.99, "stock_quantity": 50},
            102: {"product_id": 102, "name": "Mouse", "price": 29.99, "stock_quantity": 100},
            103: {"product_id": 103, "name": "Keyboard", "price": 79.99, "stock_quantity": 75},
            104: {"product_id": 104, "name": "Monitor", "price": 299.99, "stock_quantity": 25},
            105: {"product_id": 105, "name": "Headphones", "price": 149.99, "stock_quantity": 60}
        }

    def GetProduct(self, request, context):
        """Get product details by ID"""
        logger.info(f"GetProduct called with product_id: {request.product_id}")
        
        product = self.products.get(request.product_id)
        if product:
            return ProductResponse(
                product_id=product["product_id"],
                name=product["name"],
                price=product["price"],
                stock_quantity=product["stock_quantity"],
                success=True,
                message="Product found successfully"
            )
        else:
            return ProductResponse(
                success=False,
                message=f"Product with ID {request.product_id} not found"
            )

    def CheckStock(self, request, context):
        """Check if requested quantity is available"""
        logger.info(f"CheckStock called with product_id: {request.product_id}, quantity: {request.quantity}")
        
        product = self.products.get(request.product_id)
        if not product:
            return StockResponse(
                product_id=request.product_id,
                success=False,
                message=f"Product with ID {request.product_id} not found"
            )
        
        available = product["stock_quantity"] >= request.quantity
        return StockResponse(
            product_id=product["product_id"],
            current_stock=product["stock_quantity"],
            available=available,
            success=True,
            message=f"Stock check completed. Available: {available}"
        )

    def UpdateStock(self, request, context):
        """Update stock quantity (positive to add, negative to subtract)"""
        logger.info(f"UpdateStock called with product_id: {request.product_id}, quantity_change: {request.quantity_change}")
        
        product = self.products.get(request.product_id)
        if not product:
            return StockResponse(
                product_id=request.product_id,
                success=False,
                message=f"Product with ID {request.product_id} not found"
            )
        
        new_quantity = product["stock_quantity"] + request.quantity_change
        if new_quantity < 0:
            return StockResponse(
                product_id=product["product_id"],
                current_stock=product["stock_quantity"],
                success=False,
                message="Cannot reduce stock below zero"
            )
        
        product["stock_quantity"] = new_quantity
        return StockResponse(
            product_id=product["product_id"],
            current_stock=new_quantity,
            available=True,
            success=True,
            message=f"Stock updated successfully. New quantity: {new_quantity}"
        )

    def ListProducts(self, request, context):
        """List all available products"""
        logger.info("ListProducts called")
        
        products = []
        for product in self.products.values():
            products.append(ProductResponse(
                product_id=product["product_id"],
                name=product["name"],
                price=product["price"],
                stock_quantity=product["stock_quantity"],
                success=True,
                message="Product loaded"
            ))
        
        return ProductListResponse(
            products=products,
            success=True,
            message=f"Found {len(products)} products"
        )

# gRPC service handler
class InventoryServiceHandler:
    def __init__(self):
        self.service = InventoryService()

    def GetProduct(self, request, context):
        try:
            req = GetProductRequest(product_id=request.product_id)
            return self.service.GetProduct(req, context)
        except Exception as e:
            logger.error(f"Error in GetProduct: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return ProductResponse(success=False, message=str(e))

    def CheckStock(self, request, context):
        try:
            req = CheckStockRequest(product_id=request.product_id, quantity=request.quantity)
            return self.service.CheckStock(req, context)
        except Exception as e:
            logger.error(f"Error in CheckStock: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return StockResponse(success=False, message=str(e))

    def UpdateStock(self, request, context):
        try:
            req = UpdateStockRequest(product_id=request.product_id, quantity_change=request.quantity_change)
            return self.service.UpdateStock(req, context)
        except Exception as e:
            logger.error(f"Error in UpdateStock: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return StockResponse(success=False, message=str(e))

    def ListProducts(self, request, context):
        try:
            req = ListProductsRequest()
            return self.service.ListProducts(req, context)
        except Exception as e:
            logger.error(f"Error in ListProducts: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return ProductListResponse(success=False, message=str(e))

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # We'll add the service to server when we have proper protobuf implementation
    # For now, we'll create a simple server that can handle requests
    
    server.add_insecure_port('[::]:50052')
    server.start()
    
    logger.info("Inventory Service started on port 50052")
    print("Inventory Service is running on port 50052...")
    print("Available products:")
    inventory_service = InventoryService()
    for product_id, product in inventory_service.products.items():
        print(f"  ID: {product_id}, Name: {product['name']}, Price: ${product['price']}, Stock: {product['stock_quantity']}")
    
    try:
        while True:
            time.sleep(86400)  # Keep server running
    except KeyboardInterrupt:
        logger.info("Shutting down Inventory Service...")
        server.stop(0)

if __name__ == '__main__':
    serve()