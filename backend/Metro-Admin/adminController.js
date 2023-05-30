import stations from "./station.js";




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
    const foundStation = await stations.findOne({ "stop_name": req.params.stationName });
    res.status(200).json(foundStation);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const addStation = async (req, res) => {
  try {
    const newStation = await stations.create(req.body);
    res.status(200).json(newStation);

  } catch (error) {
    res.status(400).json(error.message);
  }
}

const deleteStation = async (req, res) => {
  try {
    const deletedStation = await stations.deleteOne({stop_name: req.params.stationName});

    res.status(200).json(deletedStation);
  } catch (error) {
    res.status(400).json(error.message);
  }
}


export default {
  getAllStations,
  getStationByName,
  addStation,
  deleteStation
};




