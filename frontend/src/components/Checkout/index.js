import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./index.css";
import { useNavigate } from "react-router-dom";
import PageIllustration from "../../ui/page-illustration";
import GoogleFontLoader from "react-google-font-loader";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import { GlobalStyle } from "../../globalStyles.js";
import Card from "./Card";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "./cardUtils";
import { Form, Field } from "react-final-form";
import { useMediaQuery } from "react-responsive";
import ReactLoading from "react-loading";
import { useUser } from "../../Context/UserContext";
import { useLocation } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  const [purchase, setPurchase] = React.useState(false);
  const [pop, setPop] = React.useState(true);
  const [error, setError] = React.useState("");
  const [mapOfInputs, setMapOfInputs] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const { user, setUser } = useUser();
  const [subscription, setSubscription] = useState("");
  const [startStation, setStartStation] = useState("");
  const [shortestPath, setShortestPath] = useState([]);

  const location = useLocation();

  const price = location.state.price;

  // fetching passed ticket data from previous page
  useEffect(() => {
    if (location.state.subscription) {
      setSubscription(location.state.subscription);
    }

    if (location.state.startLocation) {
      setStartStation(location.state.startLocation.properties.stop_name);
    }

    if (location.state.transferStations) {
      let shortestPathTemp = location.state.transferStations;
      let shortestPathArr = [];
      shortestPathTemp.map((station) => {
        shortestPathArr.push(station.name);
      });
      setShortestPath(shortestPathArr);
    }
  }, [location]);

  // desktop or mobile styling
  const isDesktop = useMediaQuery({
    query: "(min-aspect-ratio: 1/1)",
  });

  let logo = {};
  let fieldCSS = {};

  if (isDesktop) {
    logo = {
      height: "585px",
      padding: "0 30px",
      width: "450px",
      backgroundColor: "transparent",
      marginTop: "0px",
      marginBottom: "0px",
      border: "0px",
      boxShadow: "0 15px 24px rgba(37,44,65,0.16)",
    };
  } else {
    fieldCSS = {
      marginLeft: "0px",
    };
    logo = {
      border: "0px",
      boxShadow: "none",
      height: "700px",
      padding: "30px",
      width: "450px",
    };
  }

  var email = "";
  const total = price;
  if (user === null) {
    navigate("/login");
  } else {
    email = user.email;
  }

  // start of stripe

  useEffect(() => {
    //! when ever the page load it creates a stipe script
    if (!window.document.getElementById("stripe-script")) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://js.stripe.com/v2/";
      s.onload = () => {
        window["Stripe"].setPublishableKey(
          "pk_test_51NGMdQFUpR2M3acGG09EDohgOkiWklC2SjbCF9RkO6EZYAyMH5zJ4kHT9OxkTiFZ7GVZSt3VNFU1IegUTs1Gc6XK00kA9GHLVh"
        );
      };
      window.document.body.appendChild(s);
    }
  }, []);

  const onSubmit = async (values) => {
    const id = user.id;
    if (!id) {
      toast.error("Please Login to continue");
      return;
    }

    setPurchase(true);
    try {
      window.Stripe.card.createToken(
        {
          number: values.number,
          exp_month: values.expiry.split("/")[0],
          exp_year: values.expiry.split("/")[1],
          cvc: values.cvc,
          name: values.name,
        },
        (status, response) => {
          console.log("sending");
          if (status === 200) {
            axios
              .post("https://metro-payment.vercel.app/api/pay", {
                token: response,
                email: email,
                amount: total,
                uid: id,
              })
              .then((res) => {
                if (subscription !== "") {
                  axios
                    .post("https://metro-user.vercel.app/api/user/subscribe", {
                      userId: user.id,
                      subscriptionType: subscription,
                    })
                    .then((res) => {
                      if (res.status === 400) {
                        toast.error("Payment Failed", {
                          position: toast.POSITION.TOP_CENTER,
                        });
                        navigate("/fail");
                        setPurchase(false);
                        setPop(false);
                      } else {
                        toast.success("Payment Successful", {
                          position: toast.POSITION.TOP_CENTER,
                        });
                        navigate("/success");
                        setPurchase(false);
                        setPop(false);
                      }
                    })
                    .catch((err) => {
                      setPop(false);
                      setError(response.error.message);
                    });
                } else {
                  axios
                    .post("https://metro-trip.vercel.app/api/trips/book", {
                      userId: user.id,
                      startLocation: startStation,
                      totalPrice: price,
                      transferStations: shortestPath,
                    })
                    .then((res) => {
                      if (res.status === 400) {
                        toast.error("Payment Failed", {
                          position: toast.POSITION.TOP_CENTER,
                        });
                        navigate("/fail");
                        setPurchase(false);
                        setPop(false);
                      } else {
                        toast.success("Payment Successful", {
                          position: toast.POSITION.TOP_CENTER,
                        });
                        navigate("/success");
                        setPurchase(false);
                        setPop(false);
                      }
                    })
                    .catch((err) => {
                      setPop(false);
                      setError(response.error.message);
                    });
                }
              });
          } else {
            console.log(response.error.message);
            navigate("/fail");
            setPurchase(false);
            setPop(false);
            setError(response.error.message);
          }
        }
      );
    } catch (error) {
      setPurchase(false);
      setPop(false);
      setError(error.message);
      console.log(error);
    }
  };

  // end of stripe

  return (
    <>
      <GoogleFontLoader
        fonts={[
          {
            font: "Inter",
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
          },
          {
            font: "Architects Daughter",
            weights: [400],
          },
        ]}
        subsets={["latin"]}
      />
      <GlobalStyle />
      <div className="flex flex-col min-h-screen overflow-hidden">
        <main className="grow">
          <PageIllustration />
          <section className="relative">
            <div
              className="flex flex-col items-center justify-center min-h-screen"
              style={{ paddingTop: "80px", paddingBottom: "80px" }}
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                  {/* Page header */}
                  <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                    <h1 className="h1">Checkout</h1>
                  </div>
                  <div className="max-w-sm mx-auto">
                    <Form
                      onSubmit={onSubmit}
                      render={({
                        handleSubmit,
                        form,
                        submitting,
                        pristine,
                        values,
                        active,
                      }) => {
                        return (
                          <form style={logo}>
                            <Card
                              number={values.number || ""}
                              name={values.name || ""}
                              expiry={values.expiry || ""}
                              cvc={values.cvc || ""}
                              focused={active}
                            />
                            <div style={{ flexWrap: "wrap", width: "400px" }}>
                              <Field
                                style={fieldCSS}
                                disabled={true}
                                name="amount"
                                component="input"
                                type="text"
                                placeholder={total}
                              />
                              <Field
                                style={fieldCSS}
                                disabled={true}
                                name="email"
                                component="input"
                                type="text"
                                placeholder={email}
                              />
                            </div>
                            <div style={{ flexWrap: "wrap", width: "400px" }}>
                              <Field
                                style={fieldCSS}
                                name="number"
                                component="input"
                                type="text"
                                pattern="[\d| ]{16,22}"
                                placeholder="Card Number"
                                format={formatCreditCardNumber}
                                onBlur={(e) => {
                                  console.log(e);
                                  if (
                                    e.target.value.length > 15 &&
                                    !mapOfInputs.number
                                  ) {
                                    const prev = { ...mapOfInputs };
                                    prev.number = true;
                                    setMapOfInputs(prev);
                                  }
                                }}
                              />
                            </div>
                            <div style={{ flexWrap: "wrap", width: "400px" }}>
                              <Field
                                style={fieldCSS}
                                name="name"
                                component="input"
                                type="text"
                                placeholder="Name"
                                onBlur={(e) => {
                                  if (
                                    e.target.value.length > 0 &&
                                    !mapOfInputs.name
                                  ) {
                                    const prev = { ...mapOfInputs };
                                    prev.name = true;
                                    setMapOfInputs(prev);
                                  }
                                }}
                              />
                            </div>
                            <div style={{ flexWrap: "wrap", width: "400px" }}>
                              <Field
                                style={fieldCSS}
                                name="expiry"
                                component="input"
                                type="text"
                                pattern="\d\d/\d\d"
                                placeholder="Valid Thru"
                                format={formatExpirationDate}
                                onBlur={(e) => {
                                  if (
                                    e.target.value.length > 2 &&
                                    !mapOfInputs.expiry
                                  ) {
                                    const prev = { ...mapOfInputs };
                                    prev.expiry = true;
                                    setMapOfInputs(prev);
                                  }
                                }}
                              />
                              <Field
                                style={fieldCSS}
                                name="cvc"
                                component="input"
                                type="text"
                                pattern="\d{3,4}"
                                placeholder="CVC"
                                format={formatCVC}
                                onBlur={(e) => {
                                  if (
                                    e.target.value.length > 2 &&
                                    !mapOfInputs.cvc
                                  ) {
                                    const prev = { ...mapOfInputs };
                                    prev.cvc = true;
                                    setMapOfInputs(prev);
                                  }
                                }}
                              />
                            </div>

                            <div className="buttons">
                              {(!values.number ||
                                !values.name ||
                                !values.expiry ||
                                !values.cvc) && (
                                <button
                                  style={{
                                    backgroundColor: "#c6c6c6",
                                  }}
                                  disabled={true}
                                >
                                  Pay Now
                                </button>
                              )}

                              {!purchase ? (
                                values.number &&
                                values.name &&
                                values.expiry &&
                                values.cvc && (
                                  <button
                                    style={{ cursor: "pointer" }}
                                    onClick={handleSubmit}
                                  >
                                    Pay Now
                                  </button>
                                )
                              ) : (
                                <ReactLoading
                                  type={"bubbles"}
                                  color="#6415ff"
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setPurchase(false);
                                  form.reset();
                                }}
                              >
                                Reset
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate("/")}
                              >
                                Cancel
                              </button>
                              {loading && (
                                <ReactLoading
                                  type={"bubbles"}
                                  color="#ff9999"
                                />
                              )}
                            </div>
                          </form>
                        );
                      }}
                    />

                    {error && <p className="text-red-600">{error}</p>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
export default Checkout;
