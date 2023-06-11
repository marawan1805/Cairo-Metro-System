import React, { useEffect } from "react";
import Ticket from "../../components/myTickets/Ticket";
import GoogleFontLoader from "react-google-font-loader";
import { GlobalStyle } from "../../globalStyles.js";
import "./tickets.css";
import Header from "../../ui/ui/header";
import { useUser } from "../../Context/UserContext";

function TicketsPage() {
  const { user } = useUser();
  const [tripData, setTripData] = React.useState([]);
  useEffect(() => {
    if (user) {
      fetch(`https://metro-user.vercel.app/api/user/${user.id}/trips`)
        .then((response) => response.json())
        .then((data) => {
          setTripData(data.rideList);
          console.log(data);
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  const rideListArray = Object.values(tripData);
  const amount = rideListArray.map((trip, i) => {
    return <Ticket tripData={trip} key={i} />;
  });

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
        <Header />

        <main className="grow">
          <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                  <h1 className="h1">My Tickets</h1>
                </div>
                <div className="tickets-body">{amount}</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default TicketsPage;
