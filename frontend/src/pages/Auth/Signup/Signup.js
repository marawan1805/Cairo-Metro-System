import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "../../../components/Navbar/Navbar";
import "./signup.css";

function Signup() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);

  const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const handleSignUp = async () => {
    setError(null);
    try {
      await supabase.auth.signUp({
        phone: phoneNumber,
        password,
      });
      setStep(2);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    try {
      const response  = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      });
      // setSession(session);
      console.log(response)
      setStep(3);
      
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const handleAdditionalInfo = async () => {
    try {
      const user = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password,
      });
      
      const response = await fetch(
        "https://metro-user.vercel.app/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.session.access_token}`,
          },
          body: JSON.stringify({
            id: user.data.user.id,
            email: email,
            phoneNumber: phoneNumber,
            name: name,
            password: password,
          }),
        }
      );
      try {
        const { data } = await response.json();
        setUser(data);
        console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const Step1Signup = () => (
    <div className="signup-modal">
      <h2>SignUp</h2>
      <input
        className="input"
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="button"
        className="button"
        onClick={async () => {
          await handleSignUp();
        }}
      >
        Send OTP
      </button>
      <p>
        Already Have An Account? <a href="/login">Log In</a>
      </p>
      {error && <p>{error}</p>}
    </div>
  );

  const Step2Signup = () => (
    <div className="signup-modal">
      <h2>Verify OTP</h2>
      <input
        className="input"
        type="text"
        placeholder="6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button
        type="button"
        className="button"
        onClick={async () => {
          await handleVerifyOtp();
        }}
      >
        Verify OTP
      </button>
      {error && <p>{error}</p>}
    </div>
  );

  const Step3Signup = () => (
    <div className="signup-modal">
      <h2>Additional Info</h2>
      <input
        className="input"
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className="input"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button className="button" type="button"  onClick={async () => {
          await handleAdditionalInfo();
        }}>
        Complete Registration
      </button>
      {error && <p>{error}</p>}
    </div>
  );

  return (
    <div className="signup-body">
      <Navbar />
      <div className="signup-form">
        {step === 1 && <Step1Signup />}
        {step === 2 && <Step2Signup />}
        {step === 3 && <Step3Signup />}
      </div>
    </div>
  );
}

export default Signup;
