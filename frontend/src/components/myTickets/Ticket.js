import React from "react";
import "./Ticket.css";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { Link } from "react-router-dom";

const { useState } = React;

const Ticket = () => {
  // const { value } = props;
  const [active, handleActive] = useState(false);
  // const match = value.Ticket.Match;
  // const day = match.Date.substring(0, 10);
  // const tiime = match.Date.substring(11, 19);

  const match = 'match';
  const day = 'day'
  const tiime = 'time'

  const theme = createTheme({
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            backgroundColor:'grey',
            ":hover":{
              backgroundColor:'grey'
            }
          },
        },
      },
    },
  });

  return (
    <>
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
            hi
          </div>

          <div id="flightDetail">
            <div id="detailLabel" style={{ fontWeight: "bold" }}>
              To
            </div>
            bye
          </div>

          <div id="flightDetail">
          <ThemeProvider theme={theme}>
            <Button variant="contained">
            <Link className='account-link' to='/ticket'>
              Apply for refund
            </Link>
            </Button>
          </ThemeProvider>

          </div>

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
              Category:
              <span> 4</span>
            </div>
            <div
              style={{
                marginRight: "1em",
                height: "55px",
                border: "0.8px solid grey",
              }}
            ></div>
            <div
              style={{
                marginRight: "10px",
              }}
            >
              Ticket ID:
              <span> 1234</span>
            </div>
          </div>
          <div id="firstBehind">
            <div id="firstBehindDisplay">
              <div id="firstBehindRow">
                <div id="detail">
4                  <div id="detailLabel">Round</div>
                </div>
                <div id="detail">
                  {tiime}
                  <div id="detailLabel">Time</div>
                </div>
              </div>
              <div id="firstBehindRow">
                <div id="detail">
qatar                  <div id="detailLabel">Location</div>
                </div>
                <div id="detail">
20/20/2022                  <div id="detailLabel">Date</div>
                </div>
              </div>
              <div id="firstBehindRow">
                <div id="detail">
2pm                  <div id="detailLabel">Gate Opens</div>
                </div>
                <div id="detail">
                  g2
                  <div id="detailLabel">Group</div>
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
                    $23
                    <div id="priceLabel">Ticket Price</div>
                  </div>
                  <div id="price">
                    5
                    <div id="priceLabel">Category</div>
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
    </>
  );
};

export default Ticket;
