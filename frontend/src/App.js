import React from "react";
import './styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from "./components/Map/Map";
import Home from "./pages/Home/Home"
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;