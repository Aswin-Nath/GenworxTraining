from forecast import get_forecast
from alerts import warnings
from temperature import convert_to_faherheit
city=input("Enter the city name:")


temperature,rainfall=get_forecast()
temperature=convert_to_faherheit(temperature)
warning=warnings(temperature,rainfall,city)

print("ALERT:",warning)

