import React from "react";
import { useState } from "react";
import "./login.css";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PageIllustration from "../../../ui/page-illustration";
import GoogleFontLoader from "react-google-font-loader";
import { useEffect } from "react";
import { useUser } from "../../../Context/UserContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle, StyledH1 } from "../../../globalStyles.js";
import Header from "../../../ui/ui/header";

function Login() {
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError(null);
    const res = await supabase.auth.signInWithPassword({
      phone: phoneNumber,
      password,
    });
    if (res.error) {
      setError(res.error.message);
      toast.error(res.error.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setError("Login successful! Redirecting...");

      const response = await fetch(
        `https://metro-user.vercel.app/api/user/${res.data.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${res.data.session.access_token}`,
          },
        },
      );

      if (response.error) {
        setError(response.error.message);
        toast.error(response.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        const data = await response.json();
        if (keepMeSignedIn) {
          localStorage.setItem("user", JSON.stringify(data));
        }

        setUser(data);
        toast.success("Login successful! Redirecting...", {
          position: toast.POSITION.TOP_CENTER,
        });
        const preLoginRoute = localStorage.getItem("preLoginRoute");

        localStorage.removeItem("preLoginRoute");

        navigate(preLoginRoute || "/");
      }
    }
  };

  return (
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
                  <h1 className="h1">
                    Welcome back. We exist to make transportation easier.
                  </h1>
                </div>
                <div className="max-w-sm mx-auto">
                  <form>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="email"
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
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
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
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <div className="flex justify-between">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={keepMeSignedIn}
                              onChange={(e) =>
                                setKeepMeSignedIn(e.target.checked)
                              }
                            />
                            <span className="text-gray-400 ml-2">
                              Keep me signed in
                            </span>
                          </label>
                          <Link
                            href="/reset-password"
                            className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                    </div>
                    {phoneNumber && password ? (
                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                            onClick={handleLogin}
                          >
                            Sign in
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                      >
                        Sign in
                      </button>
                    )}
                  </form>

                  <div className="text-gray-400 text-center mt-6">
                    Don’t you have an account?{" "}
                    <Link
                      to="/register"
                      className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Login;
