import { Link } from "react-router-dom";
import MobileMenu from "./mobile-menu";
import logo from "../../assets/logo.png";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

export default function Header() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const SUPABASE_URL = "https://husogcjfubomhuycwuid.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c29nY2pmdWJvbWh1eWN3dWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI4NjA5NTUsImV4cCI6MTk5ODQzNjk1NX0.1W1T3X-SeDufh9AukM-TX34U01NP870I57W--eylN6w";
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("user");

    setUser(null);

    navigate("/");
  };

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link to="/" className="block" aria-label="Cruip">
              <img
                src={logo}
                style={{ width: "80px", marginLeft: "20px" }}
              ></img>
            </Link>
          </div>
          {/* If user is not logged in, show desktop navigation, else show MobileMenu */}
          {user === null ? (
            <>
              <nav className="hidden md:flex md:grow">
                {/* Desktop sign in links */}
                <ul className="flex grow justify-end flex-wrap items-center">
                  <li>
                    <Link
                      to="/login"
                      onClick={() => {
                        localStorage.setItem(
                          "preLoginRoute",
                          window.location.pathname,
                        );
                      }}
                      className="font-medium text-purple-600 hover:text-gray-200 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3"
                    >
                      Sign up
                    </Link>
                  </li>
                </ul>
              </nav>
              <MobileMenu />
            </>
          ) : (
            <MobileMenu alwaysVisible />
          )}
        </div>
      </div>
    </header>
  );
}
