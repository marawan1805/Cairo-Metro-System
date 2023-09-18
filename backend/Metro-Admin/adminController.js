import stations from "./station.js";
import routes from "./route.js";
import schedules from "./schedule.js";
import prices from "./prices.js";
import wellknown from "wellknown";
import Wkt from "wicket";
import axios from "axios";
import { uuid } from 'uuidv4';

const getAllStations = async (req, res) => {

  try {
    const allStations = await stations.find({});
    res.status(200).json(allStations);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getStationByName = async (req, res) => {
  try {
    const { stationName } = req.params.stationName;
    const foundStation = await stations.findOne({
      stop_name: req.params.stationName,
    });
    res.status(200).json(foundStation);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const addStation = async (req, res) => {
  try {
    const { geometry, route_id, stop_name, stop_id } = req.body;

    const newStation = await stations.create({ geometry, route_id, stop_name, stop_id });
    res.status(200).json(newStation);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteStation = async (req, res) => {
  try {
    const deletedStation = await stations.findOne({
      stop_name: req.params.stationName,
    });

    const deleteCount = await stations.deleteOne({
      stop_name: req.params.stationName,
    });

    res.status(200).json({
      "Successfully deleted": deletedStation.FID,
      Name: deletedStation.stop_name,
      deleteCount,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const updateRoute = async (req, res) => {
  try {
    //const options = { upsert: true };
    const updatedRoute = await routes.findOne({
      route_ID: req.params.route_id,
    });

    const newCoordinates = {
      $set: {
        geometry: req.body.geometry,
      },
    };

    const result = await updatedRoute.updateOne(newCoordinates, options);

    res
      .status(200)
      .json(
        `${result.matchedCount} document matched the route inserted, updated ${result.modifiedCount} the route coordinates`
      );
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const deleteRoute = async (req, res) => {
  try {
    const deletedRoute = await routes.findOne({
      route_ID: req.params.route_id,
    });

    const deleteCount = await routes.deleteOne({
      route_ID: req.params.route_id,
    });

    res.status(200).json({
      "Successfully deleted": deletedRoute.FID,
      Name: deletedRoute.route_ID,
      deleteCount,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const jsonToGeoJson = (stations) => {
  return {
    type: "FeatureCollection",
    features: stations.map((station) => ({
      type: "Feature",
      geometry: wellknown.parse(station.geometry),
      properties: station,
    })),
  };
};

const getAllStationsGEOJSON = async (_req, res) => {
  try {
    const allStations = await stations.find({});
    const geoJsonStations = jsonToGeoJson(allStations);
    res.status(200).json(geoJsonStations);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const jsonToGeoJsonRoutes = (routes) => {
  return {
    type: "FeatureCollection",
    features: routes.map((route) => ({
      type: "Feature",
      geometry: wellknown.parse(route.geometry),
      properties: route,
    })),
  };
};

const getAllRoutesGEOJSON = async (req, res) => {
  try {
    const allRoutes = await routes.find({});
    const geoJsonRoutes = jsonToGeoJsonRoutes(allRoutes);
    res.json(geoJsonRoutes);
  } catch (error) {
    res.send(error);
  }
};

const getAllSchedules = async (req, res) => {
  try {
    const allSchedules = await schedules.find({});

    res.status(200).json(allSchedules);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getSchedulesByStationName = async (req, res) => {
  try {
    const { station } = req.params;
    const stationSchedules = await schedules.find({ stop_name: station });
    res.json(stationSchedules);
  } catch (error) {
    res.send(error.message);
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { stopId } = req.params;
    const newSchedule = req.body;
    const schedule = await schedules.findOneAndUpdate(
      { stop_id: stopId },
      newSchedule
    );
    res.status(200).json({ newSchedule: newSchedule, oldSchedule: schedule });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAllPrices = async (req, res) => {
  try {
    const allPrices = await prices.find({});
    res.status(200).json(allPrices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePrice = async (req, res) => {
  try {
    const numOfStations = req.body.numOfStations;
    const price = req.body.price;
    const updatedDoc = await prices.findOneAndUpdate(
      { numOfStations: numOfStations },
      { $set: { price: price } }
    );

    res.status(200).json({ updatedDocument: updatedDoc });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const insertStation = async (req, res) => {
  try {
    const { lat, long, routeId, stopName, stopId, position } = req.body;


    // Fetch route from MongoDB
    const route = await routes.findOne({ route_id: routeId });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Add new station

    let wkt = new Wkt.Wkt();

    wkt.fromObject({
      type: "Point",
      coordinates: [parseFloat(lat), parseFloat(long)],
    });


    const newStationResponse = await axios.post(
      "https://metro-admin-gray.vercel.app/api/admin/addStation",
      {geometry: wkt.write(), route_id: routeId, stop_name: stopName, stop_id: stopId, fid:Math.floor(Math.random() * 100000), FID:uuid()}

    );

    
    console.log(newStationResponse);

    if (newStationResponse.status !== 200) {
      return res.status(500).json({ message: "Failed to add new station" });
    }

    const newStation = newStationResponse.data;

    let updatedLinestring;
    // Update route's LINESTRING
    position === "start" ? updatedLinestring = `${lat} ${long}, ${route.linestring}` : updatedLinestring = `${route.linestring}, ${lat} ${long}`;
    
    const updatedRoute = await routes.findOneAndUpdate({
      route_id: routeId
    },
      { linestring: updatedLinestring },
      { new: true }
    );

    res.json({ updatedRoute, newStation });
  } catch (error) {
    res.status(400).send(`${error.message}`);
  }
};

const updateStation = async (req, res) => {
  try {
    const { stationName } = req.params;
    const { lat, long, routeId } = req.body;

    // Fetch station from MongoDB
    const station = await stations.findOne({ stop_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    // Fetch route from MongoDB
    const route = await routes.findOne({ route_id: routeId });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Update station
    let wkt = new Wkt.Wkt();
    wkt.fromObject({
      type: "Point",
      coordinates: [parseFloat(lat), parseFloat(long)],
    });
    const updatedStation = await stations.findOneAndUpdate({ stop_name: stationName },
      { geometry: wkt.write(), route_id: routeId }, { new: true }
    );

    // Update route's LINESTRING
    let routeGeometry = wellknown.parse(route.geometry);
    routeGeometry.coordinates = routeGeometry.coordinates.map(coordinate => 
      (coordinate[0] === wellknown.parse(station.geometry).coordinates[0] && coordinate[1] === wellknown.parse(station.geometry).coordinates[1]) ? 
      [parseFloat(long), parseFloat(lat)] : coordinate
    );
    const updatedRoute = await routes.findOneAndUpdate({ route_id: routeId },
      { geometry: wellknown.stringify(routeGeometry) },
      { new: true }
    );

    res.json({ updatedRoute, updatedStation });
  } catch (error) {
    res.status(400).send(`${error.message}`);
  }
};

const deleteStationAndUpdateRoute = async (req, res) => {
  try {
    const { stationName } = req.params;

    // Fetch station from MongoDB
    const station = await stations.findOne({ stop_name: stationName });
    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }   

    // Fetch route from MongoDB
    const route = await routes.findOne({ route_id: station.route_id });
    if (!route) {
      console.log('Failed to find route with route_id:', station.route_id);
      return res.status(404).json({ message: "Route not found" });
    }
    // Delete station
    const deletedStation = await stations.findOneAndDelete({ stop_name: stationName });

    // Update route's LINESTRING
    let routeGeometry = wellknown.parse(route.geometry);
    routeGeometry.coordinates = routeGeometry.coordinates.filter(coordinate => 
      !(coordinate[0] === wellknown.parse(station.geometry).coordinates[0] && coordinate[1] === wellknown.parse(station.geometry).coordinates[1])
    );
    const updatedRoute = await routes.findOneAndUpdate({ route_id: station.route_id },
      { geometry: wellknown.stringify(routeGeometry) },
      { new: true }
    );

    res.json({ updatedRoute, deletedStation });
  } catch (error) {
    res.status(400).send(`${error.message}`);
  }
};

export default {
  getAllStations,
  getStationByName,
  addStation,
  deleteStation,
  deleteRoute,
  updateRoute,
  getAllStationsGEOJSON,
  getAllRoutesGEOJSON,
  getAllSchedules,
  getSchedulesByStationName,
  updateSchedule,
  getAllPrices,
  updatePrice,
  insertStation,
  updateStation,
  deleteStationAndUpdateRoute
};

// const getAllStationsCSV = async (req, res) => {
//   await writeCSV();

//   res.sendFile("C:\\Users\\alhas\\Desktop\\cairo-metro-backup\\admin\\stations.csv");
// }

// const writeCSV = async () => {
//   let stationCSV = `FID,fid,geometry,stop_id,stop_name,route_id\n`
//   const rawData = await axios.get("https://metro-admin-gray.vercel.app/api/admin");
//   const allStations = rawData.data;

//   for (let station of allStations) {
//     for (let field in station) {
//       if (field === "route_id") {
//         stationCSV += `${station[field]}`;
//       } else {
//         stationCSV += `${station[field]},`;

//       }
//     }
//     stationCSV += `\n`

//   }

//   fs.writeFileSync("./stations.csv", stationCSV);

// }
