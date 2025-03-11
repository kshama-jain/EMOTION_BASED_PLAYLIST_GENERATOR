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
            print("Location found using IP address (geocoder - ipinfo):", g.latlng)
            return g.latlng[0], g.latlng[1]
        else:
            print("ipinfo geocoder returned no location data.")
    except Exception as e:
        print(f"Error using ipinfo geocoder: {e}")

    try:
        g = geocoder.ip('me')
        if g.latlng:
            print("Location found using IP address (Alternate IPInfo):", g.latlng)
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
            "current": "temperature_2m,wind_speed_10m"
        }
        url = f"{base_url}?{urllib.parse.urlencode(params)}"

        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if 'current' in data:
            weather_data = {
                'temperature': data['current']['temperature_2m'],
                'wind_speed': data['current']['wind_speed_10m'],
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
        else:
            print("Could not retrieve weather information.")
    else:
        print("Could not determine current location.")