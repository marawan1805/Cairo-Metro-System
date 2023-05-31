const csv = require("csv-parser");
const { startCase } = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const { PythonShell } = require("python-shell");
const fs = require("fs");
const cors = require("cors");
const app = express();
const { Station, Route } = require("./schema");
require("./mongo");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());
let routesData = {};

async function generateMetroGraphWithRoutes() {
  try {
    let data = await Route.find({}).exec();

    console.log(data);

    data.forEach((row) => {
      // Parse the geometry and save it in the routesData object
      let geometry = row["geometry"].match(/\(([^)]+)\)/)[1].split(", ");
      let points = geometry.map((str) => str.split(" ").map(Number));
      routesData[row["route_id"]] = points;

      fs.readFile("metro_graph.json", "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        let graph = JSON.parse(jsonString);
        for (let station in graph) {
          for (let connectedStation in graph[station]["connections"]) {
            let routeId =
              graph[station]["connections"][connectedStation]["route_id"];
            let routePoints = routesData[routeId];
            let minDistance = Infinity;
            let closestPointIndex;
            for (let i = 0; i < routePoints.length; i++) {
              let d = distance(graph[station]["coordinates"], routePoints[i]);
              if (d < minDistance) {
                minDistance = d;
                closestPointIndex = i;
              }
            }
            graph[station]["routes"] = graph[station]["routes"] || {};
            graph[station]["routes"][routeId] = {
              routePointIndex: closestPointIndex,
            };
          }
        }
        fs.writeFile(
          "metro_graph_with_routes.json",
          JSON.stringify(graph),
          (err) => {
            if (err) {
              console.log("File write failed:", err);
            } else {
              console.log("Successfully wrote metro_graph_with_routes.json");
            }
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
  }
}

Station.watch().on("change", (data) => {
  console.log("Change detected;");
  console.log("Stations collection was changed, updating JSON");
  PythonShell.run("precompute.py");
  generateMetroGraphWithRoutes();
});

Route.watch().on("change", (data) => {
  console.log("Change detected;");
  console.log("Routes collection was changed, updating JSON");
  PythonShell.run("precompute.py");
  generateMetroGraphWithRoutes();
});

function distance([x1, y1], [x2, y2]) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function findShortestPath(graph, startNode, endNode) {
  let times = {};
  let backtrace = {};
  let pq = new PriorityQueue();

  times[startNode] = 0;

  pq.enqueue([startNode, 0]);

  while (!pq.isEmpty()) {
    let shortestStep = pq.dequeue();
    let currentNode = shortestStep[0];

    for (let neighbor in graph[currentNode]["connections"]) {
      let time = graph[currentNode]["connections"][neighbor]["distance"];
      let routeId = graph[currentNode]["connections"][neighbor]["route_id"];
      let timeFromStart = times[currentNode] + time;
      if (!times[neighbor] || times[neighbor] > timeFromStart) {
        times[neighbor] = timeFromStart;
        backtrace[neighbor] = { prevNode: currentNode, routeId };
        pq.enqueue([neighbor, timeFromStart]);
      }
    }
  }

  let path = [endNode];
  let lastStep = endNode;

  while (lastStep !== startNode) {
    path.unshift(backtrace[lastStep].prevNode);
    lastStep = backtrace[lastStep].prevNode;
  }

  let pathWithRoutePoints = [];

  // For each station pair in path, add the corresponding part of the route
  for (let i = 0; i < path.length - 1; i++) {
    let start = path[i];
    let end = path[i + 1];
    let routeId = graph[start].connections[end].route_id;

    // Get the indices of the route points for the start and end stations
    let startIndex = graph[start].routes[routeId].routePointIndex;
    let endIndex = graph[end].routes[routeId].routePointIndex;

    // Get the part of the route between the start and end stations
    let routePoints;
    console.log(`// ${routesData[routeId]}`);
    if (startIndex < endIndex) {
      routePoints = routesData[routeId].slice(startIndex, endIndex + 1);
    } else {
      routePoints = routesData[routeId]
        .slice(endIndex, startIndex + 1)
        .reverse();
    }

    pathWithRoutePoints.push({
      name: start,
      coordinates: graph[start].coordinates,
      routePoints: routePoints,
    });
  }

  // Don't forget to add the last station
  pathWithRoutePoints.push({
    name: endNode,
    coordinates: graph[endNode].coordinates,
    routePoints: [],
  });

  return {
    path: pathWithRoutePoints,
    distance: times[endNode],
  };
}

class PriorityQueue {
  constructor() {
    this.collection = [];
  }

  enqueue(element) {
    if (this.isEmpty()) {
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.collection.length; i++) {
        if (element[1] < this.collection[i - 1][1]) {
          this.collection.splice(i - 1, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.collection.push(element);
      }
    }
  }

  dequeue() {
    let value = this.collection.shift();
    return value;
  }

  isEmpty() {
    return this.collection.length === 0;
  }
}

app.get("/shortest_path", async (req, res)  => {
  await generateMetroGraphWithRoutes();
  const { startStation, endStation } = req.query;
  fs.readFile("metro_graph_with_routes.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return res.sendStatus(500);
    }
    const graph = JSON.parse(jsonString);
    const path = findShortestPath(graph, startStation, endStation);
    return res.send(path);
  });
});

app.listen(3000, () => console.log(`Server running on port 3000`));
