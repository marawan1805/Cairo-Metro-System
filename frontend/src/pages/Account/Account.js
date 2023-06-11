import React, { useState, useEffect } from "react";
import { Grid, Button } from "@material-ui/core";
import { createClient } from "@supabase/supabase-js";
import { GlobalStyle } from "../../globalStyles";
import Header from "../../ui/ui/header";
import PageIllustration from "../../ui/page-illustration";
import { ToastContainer, toast } from "react-toastify";
import GoogleFontLoader from "react-google-font-loader";
import { Link } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { Typography, Paper, Box } from "@material-ui/core";

function AccountDetails() {
  const [view, setView] = useState("main");
  const [subscriptions, setSubscriptions] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { user, setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setPassword(user.password);
    }
  }, [user]);
  const handleEditProfile = () => {
    setView("editProfile");
  };

  const handleViewSubscriptions = () => {
    fetchSubscriptions();
    setView("viewSubscriptions");
  };

  const fetchSubscriptions = async () => {
    const response = await fetch(`https://metro-user.vercel.app/api/user/${user.id}/subscription`);
    const data = await response.json();
    console.log(data);
    setSubscriptions(data);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Call your /api/user endpoint here with the updated information
    const response = await fetch("https://metro-user.vercel.app/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name,
        email,
        phoneNumber,
        password,
        isSenior: user.isSenior,
      }),
    });

    const data = await response.json();
    if (data.error) {
      // Optional: Show error message
      toast.error(data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else {
      // Update the user context with the new information
      setUser(data);

      // Optional: Show success message
      toast.success("Profile updated successfully!", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const renderMain = () => (
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
                  <h1 className="h1">Profile</h1>
                </div>
                <Grid
                  container
                  spacing={3}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  style={{ minHeight: "30vh" }}
                >
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleViewSubscriptions}
                    >
                      View Subscriptions
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
  const handleBackToMain = () => {
    setView("main");
};
  const renderEditProfile = () => (
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
              
                  <h1 className="h1">Edit Profile</h1>
                  <div style={{height: "20px"}}></div>
                  <Button variant="contained" color="secondary" onClick={handleBackToMain}>
      Back
    </Button>
                </div>
                
                <div className="max-w-sm mx-auto">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="name"
                        >
                          Name
                        </label>
                        <input
                          className="form-input w-full text-gray-700"
                          placeholder="Name"
                          value={name}
                          type="text"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="email"
                        >
                          Email
                        </label>
                        <input
                          className="form-input w-full text-gray-700"
                          placeholder="Email"
                          value={email}
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                       <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          className="form-input w-full text-gray-500"
                          value={user.phoneNumber}
                          type="text"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="id"
                        >
                          ID
                        </label>
                        <input
                          className="form-input w-full text-gray-500"
                          value={user.id}
                          type="text"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="isSenior"
                        >
                          Is Senior
                        </label>
                        <input
                          className="form-input w-full text-gray-500"
                          value={user.isSenior ? "Yes" : "No"}
                          type="text"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="nationalId"
                        >
                          National ID
                        </label>
                        <input
                          className="form-input w-full text-gray-500"
                          value={user.nationalId}
                          type="text"
                          disabled
                        />
                      </div>
                    </div>

                    {phoneNumber && password ? (
                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                            type="submit"
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                            disabled
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
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

  const renderViewSubscriptions = () => {
    let daysLeft;
  
    if (subscriptions && subscriptions.subscription) {
      const expiryDate = new Date(subscriptions.subscription.expiryDate);
      daysLeft = Math.floor((expiryDate - new Date()) / 86400000);
    }
  
    return (
      <Paper elevation={3}>
        <Box p={3} textAlign="center">
          {subscriptions && subscriptions.subscription ? (
            <>
              <Typography variant="h5">{subscriptions.subscription.id}</Typography>
              <Typography variant="body1">{subscriptions.subscription.type}</Typography>
              <Typography variant="h4">Expires in:</Typography>
              <Typography variant="body2">{daysLeft} days</Typography>
            </>
          ) : (
            <Typography variant="h5">No subscriptions found</Typography>
          )}
          <Box mt={3}>
            <Button variant="contained" color="secondary" onClick={handleBackToMain}>
              Back
            </Button>
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <div>
      {view === "main" && renderMain()}
      {view === "editProfile" && renderEditProfile()}
      {view === "viewSubscriptions" && renderViewSubscriptions()}
    </div>
  );
}

export default AccountDetails;
