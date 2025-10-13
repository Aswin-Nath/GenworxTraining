@echo off
echo ========================================
echo Starting Service-to-Service gRPC Demo
echo ========================================
echo.
echo This script will start all three services in separate command windows:
echo - User Service (Port 50051)
echo - Inventory Service (Port 50052) 
echo - Order Service (Port 50053)
echo.
echo Make sure you have grpcio installed: pip install grpcio
echo.
pause

echo Starting User Service...
start "User Service" cmd /k "cd /d "%~dp0" && python user_service.py"
timeout /t 2

echo Starting Inventory Service...
start "Inventory Service" cmd /k "cd /d "%~dp0" && python inventory_service.py"
timeout /t 2

echo Starting Order Service...
start "Order Service" cmd /k "cd /d "%~dp0" && python order_service.py"
timeout /t 2

echo.
echo =========================================
echo All services are starting up...
echo =========================================
echo.
echo Wait a few seconds for all services to initialize, then run:
echo python cli_client.py
echo.
echo Press any key to start the CLI client...
pause

echo Starting CLI Client...
python cli_client.py

echo.
echo Demo completed. You can close the service windows manually.
pause