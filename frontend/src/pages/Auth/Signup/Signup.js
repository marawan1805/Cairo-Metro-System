import React, { useState } from 'react'
import { createClient } from "@supabase/supabase-js";
import Navbar from '../../../components/Navbar/Navbar';
import './signup.css'
import ComplexGradientAnimation from '../../../components/Canvas';

function Signup() {
      const [step, setStep] = useState(1);
      const [phoneNumber, setPhoneNumber] = useState("");
      const [password, setPassword] = useState("");
      const [otp, setOtp] = useState("");
      const [fullName, setFullName] = useState("");
      const [error, setError] = useState(null);

      const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
      const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        }
      };
    
      const Step1Signup = () =>
        <div className='signup-modal'>
            <h2>SignUp</h2>
            <input
            className='input'
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <input
              className='input'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className='button' onClick={() => setStep(2)}>
              Send OTP
            </button>
            <p>Already Have An Account? <a href='/login'>Log In</a></p>
            {error && <p>{error}</p>}
          </div>
      
      const Step2Signup = () => 
          <div className='signup-modal'>
            <h2>Verify OTP</h2>
            <input
            className='input'
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="button" className='button' onClick={() => setStep(3)}>
              Verify OTP
            </button>
            {error && <p>{error}</p>}
          </div>

      const Step3Signup = () =>
          <div className='signup-modal'>
            <h2>Additional Info</h2>
            <input
            className='input'
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <button className='button' type="button" onClick={handleAdditionalInfo}>
              Complete Registration
            </button>
            {error && <p>{error}</p>}
          </div>

      return(
        <div className='signup-body'> 
        <Navbar />
        <div><ComplexGradientAnimation /></div>
        <div className='signup-form'>
        { step === 1 && <Step1Signup/> }
        { step === 2 && <Step2Signup/> }
        { step === 3 && <Step3Signup/> }
        </div>
        </div>
       
      );
}

export default Signup