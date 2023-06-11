import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import PageIllustration from "../../../ui/page-illustration";
import GoogleFontLoader from "react-google-font-loader";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

import { GlobalStyle, StyledH1 } from "../../../globalStyles.js";
import Header from "../../../ui/ui/header";

function Signup() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nationalId, setNationalId] = useState(0);
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
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
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
      const response = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: "sms",
      });
      if (response.error) {
        setError(response.error.message);
      } else {
        await handleAdditionalInfo();
      }
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
            nationalId: parseInt(nationalId),
          }),
        }
      );
      const { data } = await response.json();
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setTimeout(() => {
          navigate("/", {
            state: { dat: data },
          });
        }, 2000);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
          <PageIllustration />
          <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                {/* Page header */}
                <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                  <h1 className="h1">
                    Welcome. We exist to make entrepreneurship easier.
                  </h1>
                </div>
                <div className="max-w-sm mx-auto">
                  <form>
                    {step === 1 ? (
                      <div>
                        <div className="flex flex-wrap -mx-3 mb-4">
                          <div className="w-full px-3">
                            <label
                              className="block text-gray-300 text-sm font-medium mb-1"
                              htmlFor="phone"
                            >
                              Phone Number
                            </label>
                            <input
                              className="form-input w-full text-gray-700"
                              placeholder="Phone Number"
                              value={phoneNumber}
                              type="tel"
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                            />
                          </div>
                          <div className="w-full px-3">
                            <label
                              className="block text-gray-300 text-sm font-medium mb-1"
                              htmlFor="name"
                            >
                              Full Name
                            </label>
                            <input
                              className="form-input w-full text-gray-700"
                              placeholder="Full Name"
                              value={name}
                              type="text"
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
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
                          <div className="w-full px-3">
                            <label
                              className="block text-gray-300 text-sm font-medium mb-1"
                              htmlFor="password"
                            >
                              Password
                            </label>
                            <input
                              className="form-input w-full text-gray-700"
                              placeholder="Password"
                              value={password}
                              type="password"
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="w-full px-3">
                            <label
                              className="block text-gray-300 text-sm font-medium mb-1"
                              htmlFor="confirm-password"
                            >
                              Confirm Password
                            </label>
                            <input
                              className="form-input w-full text-gray-700"
                              placeholder="Confirm Password"
                              value={confirmPassword}
                              type="password"
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="w-full px-3">
                            <label
                              className="block text-gray-300 text-sm font-medium mb-1"
                              htmlFor="national-id"
                            >
                              National ID
                            </label>
                            <input
                              className="form-input w-full text-gray-700"
                              placeholder="National ID"
                              value={nationalId}
                              type="text"
                              onChange={(e) => setNationalId(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mt-6">
                          <div className="w-full px-3">
                            <button
                              className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                              onClick={async (event) => {
                                event.preventDefault();
                                await handleSignUp();
                              }}
                            >
                              Send OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-wrap -mx-3 mb-4">
                          <div className="w-full px-3">
                            <label
                              className="block text-gray-300 text-sm font-medium mb-1"
                              htmlFor="otp"
                            >
                              Enter OTP
                            </label>
                            <input
                              className="form-input w-full text-gray-700"
                              placeholder="Enter OTP"
                              value={otp}
                              type="text"
                              onChange={(e) => setOtp(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mt-6">
                          <div className="w-full px-3">
                            <button
                              className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                              onClick={async (event) => {
                                event.preventDefault();
                                await handleVerifyOtp();
                              }}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="text-gray-400 text-center mt-6">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                    >
                      Sign in
                    </Link>
                  </div>
                  {error && <p className="text-red-600">{error}</p>}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
export default Signup;
