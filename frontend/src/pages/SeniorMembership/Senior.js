import React from "react";
import { useState } from "react";
import "./senior.css";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PageIllustration from "../../ui/page-illustration";
import GoogleFontLoader from "react-google-font-loader";
import { useEffect } from "react";
import { useUser } from "../../Context/UserContext";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle, StyledH1 } from "../../globalStyles.js";
import Header from "../../ui/ui/header";
import ImageUpload from "./ImageUpload";

function Senior() {
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const [idImage, setIdImage] = useState("");

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  const handleApply = async (event) => {
    event.preventDefault();

    if (user && idImage) {
      const response = await fetch(
        "https://metro-user.vercel.app/api/user/senior",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: Math.floor(Math.random() * 100000),
            userId: user.id,
            idImage,
          }),
        },
      );
      const data = await response.json();
      if (!data.error) {
        toast.success("Senior request applied successfully!");
        navigate("/");
      } else {
        if (
          data.error.includes(
            "Unique constraint failed on the fields: (`id`)",
          ) ||
          data.error.includes(
            "Unique constraint failed on the fields: (`userId`)",
          )
        ) {
          toast.error("You already applied for a senior request!");
        } else {
          toast.error("Something went wrong!");
        }
      }
    } else {
      toast.error("Please enter all the required fields!");
    }
  };

  const handleImageUpload = (url) => {
    setIdImage(url);
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
                  <h1 className="h1">Apply for a Senior Request.</h1>
                </div>
                <div className="max-w-sm mx-auto">
                  <form>
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="image"
                        >
                          ID Image
                        </label>
                        <ImageUpload onImageUpload={handleImageUpload} />
                      </div>
                    </div>

                    {idImage ? (
                      <div className="flex flex-wrap -mx-3 mt-6">
                        <div className="w-full px-3">
                          <button
                            className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                            onClick={handleApply}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled
                        className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                      >
                        Apply
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Senior;
