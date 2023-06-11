"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { createClient } from "@supabase/supabase-js";

export default function MobileMenu({ alwaysVisible }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, setUser } = useUser();
  const trigger = useRef(null);
  const mobileNav = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("user");

    setUser(null);
  };
  return (
    <div className={alwaysVisible ? "" : "md:hidden"}>
      {/* Hamburger button */}
      <button
        ref={trigger}
        className={`hamburger ${mobileNavOpen && "active"}`}
        aria-controls="mobile-nav"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <span className="sr-only">Menu</span>
        <svg
          className="w-6 h-6 fill-current text-gray-300 hover:text-gray-200 transition duration-150 ease-in-out"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="4" width="24" height="2" rx="1" />
          <rect y="11" width="24" height="2" rx="1" />
          <rect y="18" width="24" height="2" rx="1" />
        </svg>
      </button>

      {/*Mobile navigation */}
      <nav
        id="mobile-nav"
        ref={mobileNav}
        className="absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out"
        style={
          mobileNavOpen
            ? { maxHeight: mobileNav.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0.8 }
        }
      >
        {user === null ? (
          <ul className="bg-gray-800 px-4 py-2">
            <li>
              <Link
                to="/login"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="font-medium w-full inline-flex items-center justify-center border border-transparent px-4 py-2 my-2 rounded-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out"
                onClick={() => setMobileNavOpen(false)}
              >
                Sign up
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="bg-gray-800 px-4 py-2">
            <li>
              <Link
                to="/"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/map"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                Map
              </Link>
            </li>
            <li>
              <Link
                to="/ticket"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                My Tickets
              </Link>
            </li>
            <li>
              <Link
                to="/senior"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                Senior Request
              </Link>
            </li>

            <li>
              <Link
                to="/subscribe"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                Subscription
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                onClick={() => setMobileNavOpen(false)}
              >
                My Profile
              </Link>
            </li>

            <li>
              <Link
                className="font-medium w-full inline-flex items-center justify-center border border-transparent px-4 py-2 my-2 rounded-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out"
                onClick={handleLogout}
              >
                Logout
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}
