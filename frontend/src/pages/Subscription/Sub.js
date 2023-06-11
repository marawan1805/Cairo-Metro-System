import React from "react";
import { useState } from "react";
import "./Sub.css";
import { useNavigate } from "react-router-dom";
import PageIllustration from "../../ui/page-illustration";
import GoogleFontLoader from "react-google-font-loader";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle } from "../../globalStyles.js";
import Header from "../../ui/ui/header";

function Subscription() {
  const navigate = useNavigate();

  const currentSubscription = null;

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  const [subscriptionType, setSubscriptionType] = useState("");
  const [error, setError] = useState(null);
  const [price, setPrice] = useState(0);

  const handleClick = async (event) => {
    event.preventDefault();

    if (subscriptionType) {
      navigate("/payment", {
        state: { price: price, subscription: subscriptionType },
      });
    } else {
      setError("Please select a subscription type and a zone");
    }
  };

  const handleSubscriptionChange = (e) => {
    const selectedSubscription = e.target.value;
    setSubscriptionType(selectedSubscription);

    let price = 0;
    if (selectedSubscription === "monthly") {
      price = 185;
    } else if (selectedSubscription === "quarterly") {
      price = 230;
    } else if (selectedSubscription === "annual") {
      price = 360;
    }
    setPrice(price);
  };

  return (
    <>
      <ToastContainer />
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
        <Header />
        <main className="grow">
          <PageIllustration />
          <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                  <h1 className="h1">Subscription</h1>
                </div>
                <div className="max-w-sm mx-auto">
                  <form>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="zones"
                        >
                          Subscription Type
                        </label>
                        <select
                          id="subscription-type"
                          className="form-input w-full text-gray-700"
                          style={{ height: "3rem" }}
                          value={subscriptionType}
                          onChange={handleSubscriptionChange}
                        >
                          <option value="">Select subscription type</option>
                          <option value="monthly">Monthly - 185 EGP</option>
                          <option value="quarterly">Quarterly - 230 EGP</option>
                          <option value="annual">Annual - 360 EGP</option>
                        </select>
                      </div>
                    </div>

                    {currentSubscription && (
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                          <p className="text-gray-300 text-sm font-medium mb-1">
                            Current subscription: {currentSubscription.type} for{" "}
                            {currentSubscription.zones} zones
                          </p>
                        </div>
                      </div>
                    )}

                    {price > 0 && (
                      <div className="flex flex-wrap -mx-3 mb-4">
                        <div className="w-full px-3">
                          <p className="text-gray-300 text-sm font-medium mb-1">
                            Price: {price} EGP
                          </p>
                        </div>
                      </div>
                    )}

                    {subscriptionType ? (
                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                            onClick={handleClick}
                          >
                            Subscribe
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                      >
                        Subscribe
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Subscription;
