import csv
import json
import re
from collections import defaultdict
from geopy.distance import geodesic

# Pattern for extracting coordinates from POINT and LINESTRING entries
coord_pattern = re.compile(r"\((.+)\)")

# Load the stops data
stops = {}
with open('cairo_metro_stops.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        coordinates = tuple(map(float, coord_pattern.search(row['geometry']).group(1).split()))
        stops[row['stop_name']] = {'coordinates': coordinates, 'connections': defaultdict(list)}

# Function to calculate distance between two coordinates
def calculate_distance(coord1, coord2):
    return geodesic(coord1, coord2).kilometers

# Load the routes data
with open('cairo_metro_trips.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        route_coordinates = [tuple(map(float, coords.split())) for coords in coord_pattern.findall(row['geometry'])[0].split(",")]
        for i in range(len(route_coordinates) - 1):
            start_coords, end_coords = route_coordinates[i], route_coordinates[i+1]
            start_station = min(stops, key=lambda s: calculate_distance(stops[s]['coordinates'], start_coords))
            end_station = min(stops, key=lambda s: calculate_distance(stops[s]['coordinates'], end_coords))

            # Update the stations' connections
            if start_station != end_station:  # Ensure the station is not connected to itself
                if end_station not in stops[start_station]['connections']:
                    stops[start_station]['connections'][end_station] = {'route_id': row['route_id'], 'distance': calculate_distance(stops[start_station]['coordinates'], stops[end_station]['coordinates'])}
                if start_station not in stops[end_station]['connections']:
                    stops[end_station]['connections'][start_station] = {'route_id': row['route_id'], 'distance': calculate_distance(stops[start_station]['coordinates'], stops[end_station]['coordinates'])}

# Output the graph to a JSON file
with open('metro_graph.json', 'w') as f:
    json.dump(stops, f)
