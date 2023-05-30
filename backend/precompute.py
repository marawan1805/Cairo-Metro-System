import re
import json
from collections import defaultdict
from geopy.distance import geodesic
from pymongo import MongoClient
import os 

coord_pattern = re.compile(r"\((.+)\)")

client = MongoClient('mongodb+srv://alhassan:p7OcHSJ3LRpJTgHz@stations.r5pneer.mongodb.net/stations?retryWrites=true&w=majority')
db = client.stations
stops_collection = db.stations
routes_collection = db.routes

stops = {}
for stop in stops_collection.find():
    coordinate_string = coord_pattern.search(stop['geometry']).group(1).strip()
    coordinates = tuple(float(coord) for coord in coordinate_string.split(' ') if coord)

    stops[stop['stop_name']] = {'coordinates': coordinates, 'connections': defaultdict(list)}

def calculate_distance(coord1, coord2):
    return geodesic(coord1, coord2).kilometers

for row in routes_collection.find():
    route_coordinates = [tuple(map(float, coords.split())) for coords in coord_pattern.findall(row['geometry'])[0].split(",")]
    for i in range(len(route_coordinates) - 1):
        start_coords, end_coords = route_coordinates[i], route_coordinates[i+1]
        start_station = min(stops, key=lambda s: calculate_distance(stops[s]['coordinates'], start_coords))
        end_station = min(stops, key=lambda s: calculate_distance(stops[s]['coordinates'], end_coords))

        if start_station != end_station:
            if end_station not in stops[start_station]['connections']:
                stops[start_station]['connections'][end_station] = {'route_id': row['route_id'], 'distance': calculate_distance(stops[start_station]['coordinates'], stops[end_station]['coordinates'])}
            if start_station not in stops[end_station]['connections']:
                stops[end_station]['connections'][start_station] = {'route_id': row['route_id'], 'distance': calculate_distance(stops[start_station]['coordinates'], stops[end_station]['coordinates'])}

if os.path.exists('metro_graph.json'):
    os.remove('metro_graph.json')

with open('metro_graph.json', 'w') as f:
    json.dump(stops, f)