import React from "react";
import "./styles.css";
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
// import Login from "./pages/Auth/Login/Login";
// import Signup from "./pages/Auth/Signup/Signup";
import Account from "./pages/Account/Account";
import Payment from "./components/Checkout/index";
import Metro from "./pages/Metro";
import Senior from "./pages/SeniorMembership/Senior";
import TicketsPage from "./pages/Tickets/TicketsPage";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Signup/Signup";
import PaymentSuccess from "./components/paymentSF/PaymentSuccess";
import PaymentFail from "./components/paymentSF/PaymentFail";
import { UserProvider } from "./Context/UserContext.js";
import Subscription from "./pages/Subscription/Sub";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Metro />} />

          <Route path="/account" element={<Account />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/ticket" element={<TicketsPage />} />
          <Route path="/senior" element={<Senior />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/fail" element={<PaymentFail />} />
          <Route path="/subscribe" element={<Subscription />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
