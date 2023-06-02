import React from "react";
import { useState } from "react";
import "./login.css";
import { createClient } from "@supabase/supabase-js";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

// In your component
function Login() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


  const handleLogin = async () => {
    setError(null);
    const user = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("User logged in successfully");

      // Fetch user info from your custom users table
      const response = await fetch(
        `https://metro-user.vercel.app/api/user/${user.data.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.session.access_token}`,
          },
        }
      );
   
      if (response) {
        const data = await response.json();
        console.log(data);
        
        navigate("/metro", {
          state: { dat: data },
        });
      } else {
        console.log("No data");
      }
    }
  };

  return (
    <div className="login-body">
      <Navbar />

      <div className="login-modal">
        <h2>Login</h2>
        <input
          className="input"
          placeholder="Phone Number"
          value={phoneNumber}
          type="tel"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {phoneNumber && password ? (
          <button className="button" onClick={handleLogin}>
            Login
          </button>
        ) : (
          <button disabled className="button" onClick={handleLogin}>
            Login
          </button>
        )}

        <div className="text-center">
          <p>
            Don't Have An Acount? <a href="/signup"> Sign Up</a>
          </p>
        </div>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
