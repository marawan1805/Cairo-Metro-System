import { PrismaClient, Prisma } from "@prisma/client";

//Database enums, user RideStatus.pending for example
import { UserRole } from "@prisma/client";
import { RouteId } from "@prisma/client";
import { RefundRequestStatus } from "@prisma/client";
import { SeniorRequestStatus } from "@prisma/client";
import { SubscriptionType } from "@prisma/client";
import { uuid } from "uuidv4";
import moment from "moment";
const prisma = new PrismaClient();

const users = prisma.User; //use users.findMany() for example, instead of typing prisma.User every time
const refundRequest = prisma.RefundRequest;
const seniorRequest = prisma.SeniorRequest;
const subscription = prisma.Subscription;
const trip = prisma.Trip;

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.findMany();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, email, phoneNumber, name, password, isSenior } = req.body;
    const updatedUser = await users.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        password: password,
        isSenior: isSenior,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = red.params.id;
    const deletedUser = await users.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUserSubscription = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(typeof id);
    const subscription = await users.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
        subscription: true,
      },
    });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getUserTrips = async (req, res) => {
  let filteredOutput = {};
  try {
    const id = req.params.id;
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        rides: true,
      },
    });
    const rides = result.rides;
    const userName = result.name;
    filteredOutput["name"] = userName;
    filteredOutput["rideList"] = { ...rides };

    res.status(200).json(filteredOutput);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const registerUser = async (req, res) => {
  const { id, name, phoneNumber, password, email, nationalId } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        id, // saving Supabase user_id
        name,
        phoneNumber,
        role: "User",
        password,
        email,
        isSenior: false,
        nationalId
      },
    });

    res.status(200).json({ data: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createRefundRequest = async (req, res) => {
  try {
    const { userId, description, tripId } = req.body;
    const result = await trip.findUnique({
      where: {
        id: tripId,
      }
    });
 
    const status = result.status;
  
    if (status.includes("ongoing")) {
      const tripRefunds = await refundRequest.findMany({
        where: {
          tripId: tripId
        }
      })
      if (tripRefunds.length !== 0) {
        res.status(400).json({error: "A refund request already exists for this trip."});
      } else {
        const newRefundRequest = await refundRequest.create({
          data: {
            description: description,
            status: RefundRequestStatus.Pending,
            createdAt: new Date(),
            tripId: tripId,
            userId: userId,
          },
        });
        res.status(200).json({ data: newRefundRequest });
      }
    } else {
      res.status(400).json({ error: "Request is rejected, trip status is no longer ongoing"});
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createSeniorRequest = async (req, res) => {
  const { id, userId, idImage } = req.body;

  try {
    const newSeniorRequest = await seniorRequest.create({
      data: {
        id,
        userId,
        idImage,
        createdAt: new Date(),
        status: SeniorRequestStatus.Pending,
      },
    });

    res.status(200).json({ data: newSeniorRequest });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createSubscription = async (req, res) => {
  const { subscriptionType, userId } = req.body;
  let subscriptionData = { type: null, expiryDate: null };

  if (subscriptionType.toUpperCase() === "MONTHLY".toUpperCase()) {
    subscriptionData.type = SubscriptionType.Monthly;
    subscriptionData.expiryDate = new Date(moment().add(1, "months").format());
  } else if (subscriptionType.toUpperCase() === "QUARTERLY".toUpperCase()) {
    subscriptionData.type = SubscriptionType.Quarterly;
    subscriptionData.expiryDate = new Date(moment().add(3, "months").format());
  } else if (subscriptionType.toUpperCase() === "ANNUAL".toUpperCase()) {
    subscriptionData.type = SubscriptionType.Annual;
    subscriptionData.expiryDate = new Date(moment().add(1, "years").format());
  }
  try {
    const newSeniorRequest = await subscription.create({
      data: {
        id: uuid(),
        ...subscriptionData,
      },
    });

    const subscribedUser = await users.update({
      where: {
        id: userId,
      },
      data: {
        subscriptionId: newSeniorRequest.id,
      },
    });

    res.status(200).json({ seniorRequest: newSeniorRequest, subscribedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserSubscription,
  getUserTrips,
  registerUser,
  createRefundRequest,
  createSeniorRequest,
  createSubscription,
};
