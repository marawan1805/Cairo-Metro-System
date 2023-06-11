import React, { useEffect, useState } from "react";
import "./Ticket.css";
import {
  Button,
  ThemeProvider,
  createTheme,
  Modal,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { ToastContainer, toast } from "react-toastify";

const Ticket = ({ tripData }) => {
  const [active, handleActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const { user } = useUser();

  const LoadingSkeleton = () => (
    <Stack
      spacing={10}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        spacing={10}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Stack spacing={1} />

        <Stack spacing={1}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", bgcolor: "lightgray" }}
          />
          <Skeleton
            variant="rectangular"
            width={410}
            height={100}
            sx={{ bgcolor: "lightgray" }}
          />
        </Stack>
        <Stack spacing={1} />
      </Stack>
      <Stack spacing={1} />
    </Stack>
  );

  const theme = createTheme({
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            backgroundColor: "grey",
            ":hover": {
              backgroundColor: "grey",
            },
          },
        },
      },
    },
  });

  if (!tripData) {
    return <LoadingSkeleton />;
  }

  const handleRefund = async () => {
    setOpen(false);

    const url = "https://metro-user.vercel.app/api/user/refund";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        description: description,
        tripId: tripData.id,
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (data.error) {
      toast.error(data.error);
    } else if(response === "A refund request already exists for this trip.") {
      toast.error(response);
    } else {
      toast.success("Refund request sent successfully");
    }
  };

  return (
    <>
    <ToastContainer />
      <div
        id="cardContainer"
        style={{
          height: active ? `300px` : `100px`,
          transition: "0.9s",
        }}
        onClick={() => {
          handleActive(!active);
        }}
      >
        <div id="firstDisplay">
          <div id="flightDetail">
            <div id="detailLabel" style={{ fontWeight: "bold" }}>
              From
            </div>
            {tripData.startLocation}
          </div>
          {tripData.transferStations && (
            <div id="flightDetail">
              <div id="detailLabel" style={{ fontWeight: "bold" }}>
                To
              </div>
              <div id="detailLabel">
                {" "}
                {tripData.transferStations.join(", ")}
              </div>
            </div>
          )}
        </div>
        <div
          id="first"
          style={{
            transform: active
              ? `rotate3d(1, 0, 0, -180deg)`
              : `rotate3d(1, 0, 0, 0deg)`,
            transitionDelay: active ? "0s" : "0.3s",
          }}
        >
          <div id="firstTop">
            <div style={{ width: "40px" }}></div>

            <div>
              Ticket ID:
              <span>{tripData.id}</span>
            </div>
            <div
              style={{
                marginRight: "1em",
                height: "55px",
                border: "0.8px solid grey",
              }}
            ></div>
            <div
              id="flightDetail"
              style={{ marginRight: "40px", fontWeight: "bold" }}
            >
              <div
                id="detailLabel"
                style={{ marginRight: "40px", fontWeight: "bold" }}
              >
                Status
              </div>
              {tripData.status}
            </div>
          </div>
          <div id="firstBehind">
            <div id="firstBehindDisplay">
              <div id="firstBehindRow">
                <div id="detail">
                  {tripData.purchasedAt.split("T")[0]}{" "}
                  <div id="detailLabel">Date</div>
                </div>
                <div id="detail">
                  {tripData.purchasedAt.split("T")[1]}{" "}
                  <div id="detailLabel">Time</div>
                </div>
              </div>

              <div id="firstBehindRow">
                <div id="flightDetail">
                  <ThemeProvider theme={theme}>
                    <Button
                      style={{ width: "130px" }}
                      variant="contained"
                      onClick={() => setOpen(true)}
                    >
                      Apply for refund
                    </Button>
                  </ThemeProvider>
                </div>
              </div>
            </div>
            <div
              id="second"
              style={{
                transform: active
                  ? `rotate3d(1, 0, 0, -180deg)`
                  : `rotate3d(1, 0, 0, 0deg)`,
                transitionDelay: active ? "0.2s" : "0.2s",
              }}
            >
              <div id="secondTop" />
              <div id="secondBehind">
                <div id="secondBehindDisplay">
                  <div id="price">
                    {tripData.totalPrice} EGP
                    <div id="priceLabel">Ticket Price</div>
                  </div>
                  <div id="price">
                    5<div id="priceLabel">Category</div>
                  </div>
                  <img
                    id="barCode"
                    src="https://github.com/pizza3/asset/blob/master/barcode.png?raw=true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "absolute",
            width: 400,
            backgroundColor: "white",
            padding: "20px",
          }}
        >
          <h2 id="modal-modal-title" style={{ color: "black" }}>
            Apply for refund
          </h2>
          <p id="modal-modal-description" style={{ color: "black" }}>
            Please enter a reason for the refund:
          </p>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleRefund}
              style={{ backgroundColor: "purple", color: "white" }}
            >
              Confirm refund
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Ticket;
