#!/bin/bash

echo "========================================"
echo "Starting Service-to-Service gRPC Demo"
echo "========================================"
echo ""
echo "This script will start all three services in separate terminals:"
echo "- User Service (Port 50051)"
echo "- Inventory Service (Port 50052)" 
echo "- Order Service (Port 50053)"
echo ""
echo "Make sure you have grpcio installed: pip install grpcio"
echo ""
read -p "Press Enter to continue..."

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "Starting User Service..."
gnome-terminal --title="User Service" -- bash -c "cd '$DIR' && python user_service.py; exec bash" 2>/dev/null || \
xterm -title "User Service" -e "cd '$DIR' && python user_service.py; bash" &
sleep 2

echo "Starting Inventory Service..."
gnome-terminal --title="Inventory Service" -- bash -c "cd '$DIR' && python inventory_service.py; exec bash" 2>/dev/null || \
xterm -title "Inventory Service" -e "cd '$DIR' && python inventory_service.py; bash" &
sleep 2

echo "Starting Order Service..."
gnome-terminal --title="Order Service" -- bash -c "cd '$DIR' && python order_service.py; exec bash" 2>/dev/null || \
xterm -title "Order Service" -e "cd '$DIR' && python order_service.py; bash" &
sleep 2

echo ""
echo "========================================="
echo "All services are starting up..."
echo "========================================="
echo ""
echo "Wait a few seconds for all services to initialize, then the CLI client will start..."
echo ""
sleep 3

echo "Starting CLI Client..."
python cli_client.py

echo ""
echo "Demo completed. You can close the service terminals manually."