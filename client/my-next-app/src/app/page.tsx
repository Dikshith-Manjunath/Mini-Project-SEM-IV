"use client";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Head from "next/head";
import ItineraryForm from "../components/Itinerary";
import ItineraryDisplay from "../components/ItineraryDisplay";
import { Itinerary } from "../../pages/api/Types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const handleItineraryGenerated = (newItinerary: Itinerary) => {
    setItinerary(newItinerary);
  };

  return (
    <>
    <div className="w-100%">
    <Navbar/>
    </div>
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Travel Itinerary Generator</title>
        <meta name="description" content="Generate personalized travel itineraries for your next adventure" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Travel Itinerary Generator</h1>
        
        <ItineraryForm 
          onItineraryGenerated={handleItineraryGenerated}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        
        {itinerary && <ItineraryDisplay itinerary={itinerary} />}
      </main>

      <footer className="py-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Travel Itinerary Generator</p>
      </footer>
    </div>
    </>
  );
}
