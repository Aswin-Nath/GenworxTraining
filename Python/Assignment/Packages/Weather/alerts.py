def warnings(rainfall,temperature,city):
    extreme_temperature=40
    extreme_rainfall=70
    if rainfall>=extreme_rainfall and temperature>=extreme_temperature:
        return f"There is a chance of both heavy rainfall and heavy temperature in city {city}"
    elif temperature>=extreme_temperature:
        return f"There is a chance of heavy temperature in the city {city}"
    elif rainfall>=extreme_rainfall:
        return f"There is a chance of heavy rainfall in the city {city}"
    else:
        return f"The climatic conditions in the city {city} is normal"