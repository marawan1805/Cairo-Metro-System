import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function Hamada() {
  const [screen, setScreen] = useState("login");

  return (
    <div>
      {screen === "login" ? (
        <Login setScreen={setScreen} />
      ) : (
        <Register setScreen={setScreen} />
      )}
    </div>
  );
}

function Login({ setScreen }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    const { user, error } = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log("User logged in successfully", user);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <input
          type="text"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="button" onClick={handleLogin}>
          Log In
        </button>
      </form>
      <button onClick={() => setScreen("register")}>Switch to Register</button>
      {error && <p>{error}</p>}
    </div>
  );
}

function Register({ setScreen }) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);
    const { user, error } = await supabase.auth.signUp({
      phone: phoneNumber,
      password,
    });

    if (error) {
      if (error.message.includes("A user with this phone already exists")) {
        setError("User is already registered");
      } else {
        setError(error.message);
      }
    } else {
      setStep(2);
    }
  };

  const handleVerifyOtp = async () => {
    setError(null);
    const { session, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otp,
      type: "sms",
    });

    if (error) {
      setError(error.message);
    } else {
      setStep(3);
    }
  };

  const handleAdditionalInfo = async () => {
    const response = await fetch("http://localhost:3001/api/registerUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, phoneNumber, password,  }),
    });
  
    const { data, error } = await response.json();
  
    if (error) {
      setError(error);
    } else {
      console.log("User registered successfully", data);
      setScreen("login");
    }
  };
  
  

  if (step === 1) {
    return (
      <div>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="button" onClick={handleSignUp}>
          Send OTP
        </button>
        <button onClick={() => setScreen("login")}>Switch to Login</button>
        {error && <p>{error}</p>}
      </div>
    );
  } else if (step === 2) {
    return (
      <div>
        <h2>Verify OTP</h2>
        <input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="button" onClick={handleVerifyOtp}>
          Verify OTP
        </button>
        {error && <p>{error}</p>}
      </div>
    );
  } else {
    return (
      <div>
        <h2>Additional Info</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <button type="button" onClick={handleAdditionalInfo}>
          Complete Registration
        </button>
        {error && <p>{error}</p>}
      </div>
    );
  }
}

export default Hamada;
