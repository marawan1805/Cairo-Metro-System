import { PrismaClient } from "@prisma/client";



//Database enums, user RideStatus.pending for example
import { RideStatus } from "@prisma/client";
import { RouteId } from "@prisma/client";
import { RefundRequestStatus } from "@prisma/client";

const prisma = new PrismaClient();

const trips = prisma.Trip; //use trips.findMany() for example, instead of typing prisma.Trip every time

const getAllTrips = async (req, res) => {
  try {
    const allTrips = await trips.findMany({});
    res.status(200).json({ allTrips });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTripById = async (req, res) => {
  try {
    const id = req.params.id;
    const trip = await trips.findUnique({
      where: {
        id: id
      }
    });

    res.status(200).json(trip);
  } catch (error) {
    res.status(400).send(error);

  }
}


const deleteTrip = async (req, res) => {
  try {
    const id = req.body.id;
    const deletedTrip = await trips.delete({
      where: {
        id: id
      }
    })
    res.status(200).json(deletedTrip);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const updateTrip = async (req, res) => {
  try {
    const id = req.body.id;
    const updatedTrip = await trips.update({
      where: {
        id: id
      },
      data: {
        userId: req.body.userId,
        startLocation: req.body.startLocation,
        purchasedAt: req.body.purchasedAt,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        route: req.body.route,
        transferStations: req.body.transferStations,
      },
    })
    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


const bookTrip = async (req, res) => {
  try {
    const trip = await trips.create({
      data: {
        userId: req.body.userId,
        startLocation: req.body.startLocation,
        purchasedAt: new Date(),
        status: RideStatus.ongoing,
        totalPrice: req.body.totalPrice,
        route:  RouteId.one ,
        transferStations: req.body.transferStations,
      },
    })
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};


export default {
  getAllTrips,
  deleteTrip,
  updateTrip,
  bookTrip,
  getTripById
};
