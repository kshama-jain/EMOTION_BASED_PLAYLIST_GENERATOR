import geocoder
import requests
import json
import time
from geopy.geocoders import Nominatim
import urllib.parse


def get_location():
    try:
        g = geocoder.ipinfo('me')
        if g.latlng:
            return g.latlng[0], g.latlng[1]
        else:
            print("ipinfo geocoder returned no location data.")
    except Exception as e:
        print(f"Error using ipinfo geocoder: {e}")

    try:
        g = geocoder.ip('me')
        if g.latlng:
            return g.latlng[0], g.latlng[1]
        else:
            print("Alternate IPInfo geocoder returned no location data.")
    except Exception as e:
        print(f"Error using alternate IPInfo geocoder: {e}")

    print("Unable to determine location.")
    return None, None


def get_weather(latitude, longitude):
    try:
        latitude_str = str(latitude).encode('ascii', 'ignore').decode('ascii')
        longitude_str = str(longitude).encode('ascii', 'ignore').decode('ascii')

        base_url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": latitude_str,
            "longitude": longitude_str,
            "current": "temperature_2m,wind_speed_10m,relative_humidity_2m",
            "daily": "weather_code"
        }
        url = f"{base_url}?{urllib.parse.urlencode(params)}"

        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if 'current' in data and 'daily' in data:
            weather_data = {
                'temperature': data['current']['temperature_2m'],
                'wind_speed': data['current']['wind_speed_10m'],
                'humidity': data['current']['relative_humidity_2m'],
                'weather_code': data['daily']['weather_code'][0],
                'latitude' : latitude,
                'longitude': longitude,
                'units': data['current_units']
            }
            return weather_data
        else:
            print("Weather data not found in response.")
            return None

    except requests.exceptions.RequestException as e:
        print(f"Error retrieving weather data: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON response: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def get_location_name(latitude, longitude):
    try:
        geolocator = Nominatim(user_agent="weather_app")
        location = geolocator.reverse((latitude, longitude), exactly_one=True, timeout=5)
        if location:
            return location.address
        else:
            return "Location not found"
    except Exception as e:
        print(f"Error getting location name: {e}")
        return "Location name unavailable"

def categorize_weather(temperature, weather_code, wind_speed, humidity, temperature_unit):
    description = ""

    if temperature_unit == "°C":
        if temperature < 10:
            description = "Cold"
        elif temperature > 25:
            description = "Hot"
    elif temperature_unit == "°F":
        if temperature < 50:
            description = "Cold"
        elif temperature > 77:
            description = "Hot"

    weather_conditions = {
        0: "Sunny",
        1: "Sunny",
        2: "Cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Fog",
        51: "Rainy",
        53: "Rainy",
        55: "Rainy",
        56: "Rainy",
        57: "Rainy",
        61: "Rainy",
        63: "Rainy",
        65: "Rainy",
        66: "Rainy",
        67: "Rainy",
        71: "Snowy",
        73: "Snowy",
        75: "Snowy",
        77: "Snowy",
        80: "Rainy",
        81: "Rainy",
        82: "Rainy",
        85: "Snowy",
        86: "Snowy",
        95 : "Thunderstorm",
        96: "Thunderstorm",
        99: "Thunderstorm"
    }
    weather_desc = weather_conditions.get(weather_code, "Unknown")

    if weather_desc in ["Sunny", "Rainy"]:
        description = weather_desc
    elif weather_desc in ["Cloudy", "Fog", "Snowy", "Thunderstorm"] and not description:
        description = weather_desc
    elif description and weather_desc not in ["Sunny", "Rainy", "Unknown"]:
         description = f"{description}, {weather_desc}"
    elif not description:
      description = "Unknown"

    if wind_speed > 10:
        description += ", Windy"
    if humidity > 80:
        description += ", Humid"

    return description

if __name__ == "__main__":
    latitude, longitude = get_location()

    if latitude is not None and longitude is not None:
        weather = get_weather(latitude, longitude)

        if weather:
            location_name = get_location_name(latitude, longitude)
            print(f"Current Location: {location_name}")
            print(f"Weather at Latitude: {weather['latitude']}, Longitude: {weather['longitude']}")
            print(f"Temperature: {weather['temperature']} {weather['units']['temperature_2m']}")
            print(f"Wind Speed: {weather['wind_speed']} {weather['units']['wind_speed_10m']}")
            print(f"Humidity: {weather['humidity']} {weather['units']['relative_humidity_2m']}")


            weather_description = categorize_weather(
                weather['temperature'],
                weather['weather_code'],
                weather['wind_speed'],
                weather['humidity'],
                weather['units']['temperature_2m'],
            )

            print(f"Weather Category: {weather_description}")

        else:
            print("Could not retrieve weather information.")
    else:
        print("Could not determine current location.")