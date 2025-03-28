"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Typewriter } from "react-simple-typewriter";

// Image list for carousel
const images = ["/travel-map.jpg", "/caravan.jpg", "/lighthouse.jpg"];
const colors = ["#14b8a6", "#f59e0b", "#e11d48"]; // Colors changing with carousel

export default function Page() {
  const [showTitle, setShowTitle] = useState(true);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  
  // Handle fade-out on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTitle(window.scrollY <= 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-slide images and color changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen bg-black">
      <Navbar />
      
      {/* Background Section with Auto-Sliding Carousel */}
      <motion.div
        className="relative w-full h-[70vh] bg-cover bg-center flex items-center justify-center px-10 transition-all duration-500"
        style={{ backgroundImage: `url(${images[index]})` }}
        whileHover={{ scale: 1.02 }}
      >
        {showTitle && (
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-white p-6 rounded-lg text-center transition-all"
            style={{ color: colors[index], fontFamily: "Poppins, sans-serif" }}
          >
            <Typewriter
              words={["Welcome to Journey AI ✈️🌍"]}
              loop={true}
              cursor
              cursorStyle="_"
              typeSpeed={90}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </motion.h1>
        )}
      </motion.div>
      
      {/* Journey AI Card */}
      <motion.div
        className="bg-black text-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-700/50 text-center max-w-4xl -mt-20 z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
      >
        <p className="text-lg md:text-xl leading-relaxed opacity-80 font-light">
          Your all-in-one AI-powered travel companion! 🚀 Our smart itinerary generator crafts personalized travel plans in seconds, while our blog delivers top travel tips and stories.
        </p>
        <p className="text-lg md:text-xl mt-4 opacity-80 font-light">
          Explore destinations through <strong className="text-teal-300">short reels</strong>, giving you a real glimpse of places before you go.
        </p>
      </motion.div>

      {/* Cards Section */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-6xl px-6">
        {[
          { title: "Real Traveler Experiences", img: "/blog-card.jpg", link: "/blog" },
          { title: "Journey AI", img: "/itinerary.jpg" },
          { title: "Explore More", img: "/explore_more.jpg" }
        ].map((card, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 rounded-xl shadow-lg p-8 md:p-10 text-center text-white min-w-[300px] min-h-[350px] md:min-h-[400px] overflow-hidden"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 30px rgba(0, 255, 255, 0.5)",
              borderColor: "#14b8a6"
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-xl font-bold mb-4">{card.title}</h2>
            <p className="opacity-80">{i === 0 ? "Authentic travel advice, straight from explorers." : i === 1 ? "Expand your reach with AI-optimized travel planning." : "Find hidden gems and must-visit destinations for your next trip."}</p>
            <img 
              src={card.img} 
              alt={card.title} 
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-4 mt-6"
            />
            {card.link && (
              <Link href={card.link}>
                <FontAwesomeIcon icon={faSquareCaretRight} size="4x" className="text-white hover:text-gray-400 cursor-pointer mt-4" />
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}


