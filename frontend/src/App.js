import React from "react";
import './styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home/Home"
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import Account from "./pages/Account/Account";
import Payment from "./components/Checkout/Checkout";
import Metro from "./pages/Metro"
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/metro" element={<Home />} />
        <Route path="/" element={<Metro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="*" element={<h1>Not Found</h1>} />

      </Routes>
    </Router>
  );
};

export default App;