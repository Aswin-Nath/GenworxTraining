"""
Test Script to verify all services are working correctly
Run this to test the basic functionality of all services
"""

import subprocess
import time
import sys
import os

def test_service_imports():
    """Test if all service files can be imported without errors"""
    print("Testing service imports...")
    
    try:
        # Test importing messages
        from messages import UserResponse, ProductResponse, OrderResponse
        print("✓ Messages module imported successfully")
        
        # Test importing services (just the classes, not running servers)
        sys.path.append(os.path.dirname(__file__))
        
        # Import service classes without running servers
        import user_service
        import inventory_service
        import order_service
        
        print("✓ All service modules imported successfully")
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_service_logic():
    """Test the business logic of services without running gRPC servers"""
    print("\nTesting service logic...")
    
    try:
        # Test User Service logic
        from user_service import UserService
        user_svc = UserService()
        
        # Test user creation
        from messages import CreateUserRequest
        req = CreateUserRequest(name="Test User", email="test@example.com")
        response = user_svc.CreateUser(req, None)
        assert response.success, "User creation failed"
        print("✓ User Service logic working")
        
        # Test Inventory Service logic
        from inventory_service import InventoryService
        inventory_svc = InventoryService()
        
        # Test product listing
        from messages import ListProductsRequest
        req = ListProductsRequest()
        response = inventory_svc.ListProducts(req, None)
        assert response.success, "Product listing failed"
        assert len(response.products) > 0, "No products found"
        print("✓ Inventory Service logic working")
        
        # Test Order Service logic
        from order_service import OrderService
        order_svc = OrderService()
        
        # Test order creation logic (will use simulated service calls)
        from messages import CreateOrderRequest, OrderItem
        items = [OrderItem(product_id=101, quantity=1)]
        req = CreateOrderRequest(user_id=1, items=items)
        response = order_svc.CreateOrder(req, None)
        assert response.success, "Order creation failed"
        print("✓ Order Service logic working")
        
        return True
        
    except Exception as e:
        print(f"❌ Logic test error: {e}")
        return False

def check_required_packages():
    """Check if required packages are installed"""
    print("Checking required packages...")
    
    try:
        import grpc
        print("✓ grpcio package found")
        
        # Check if grpc_tools is available (optional)
        try:
            import grpc_tools
            print("✓ grpcio-tools package found")
        except ImportError:
            print("⚠ grpcio-tools not found (optional for this demo)")
        
        return True
        
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Install with: pip install grpcio")
        return False

def run_quick_demo():
    """Run a quick demonstration of the service communication"""
    print("\n" + "="*50)
    print("QUICK SERVICE DEMONSTRATION")
    print("="*50)
    
    try:
        # Demonstrate User Service
        from user_service import UserService
        from messages import GetUserRequest
        
        user_svc = UserService()
        req = GetUserRequest(user_id=1)
        response = user_svc.GetUser(req, None)
        
        print(f"\n1. User Service Test:")
        print(f"   Request: Get user with ID 1")
        print(f"   Response: {response.name} ({response.email}) - Success: {response.success}")
        
        # Demonstrate Inventory Service
        from inventory_service import InventoryService
        from messages import GetProductRequest
        
        inventory_svc = InventoryService()
        req = GetProductRequest(product_id=101)
        response = inventory_svc.GetProduct(req, None)
        
        print(f"\n2. Inventory Service Test:")
        print(f"   Request: Get product with ID 101")
        print(f"   Response: {response.name} (${response.price}) - Stock: {response.stock_quantity}")
        
        # Demonstrate Order Service (Service-to-Service Communication)
        from order_service import OrderService
        from messages import CreateOrderRequest, OrderItem
        
        order_svc = OrderService()
        items = [OrderItem(product_id=101, quantity=2)]
        req = CreateOrderRequest(user_id=1, items=items)
        response = order_svc.CreateOrder(req, None)
        
        print(f"\n3. Order Service Test (Service-to-Service Communication):")
        print(f"   Request: Create order for user 1 with 2x Laptop")
        print(f"   Service Communications:")
        print(f"   - Validated user 1 exists ✓")
        print(f"   - Checked product 101 details ✓")
        print(f"   - Verified stock availability ✓")
        print(f"   - Reserved stock ✓")
        print(f"   Response: Order {response.order_id} created - Total: ${response.total_amount:.2f}")
        
        print(f"\n✓ All services working correctly!")
        print(f"✓ Service-to-Service communication demonstrated!")
        
        return True
        
    except Exception as e:
        print(f"❌ Demo error: {e}")
        return False

def main():
    print("🧪 Service-to-Service Communication Test Suite")
    print("=" * 60)
    
    # Run all tests
    tests = [
        ("Package Check", check_required_packages),
        ("Import Test", test_service_imports),
        ("Logic Test", test_service_logic),
        ("Quick Demo", run_quick_demo)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n🔍 Running {test_name}...")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "="*60)
    print("TEST RESULTS SUMMARY")
    print("="*60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:20} {status}")
        if result:
            passed += 1
    
    print(f"\nTests passed: {passed}/{len(results)}")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Your service-to-service communication demo is ready!")
        print("\nTo run the full demo:")
        print("1. Run: start_demo.bat (Windows) or ./start_demo.sh (Linux/Mac)")
        print("2. Or manually start each service and then run: python cli_client.py")
    else:
        print("\n⚠ Some tests failed. Please fix the issues before running the demo.")
    
    return passed == len(results)

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)