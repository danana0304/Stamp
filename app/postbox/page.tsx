"use client";

import { Suspense, useState, useEffect } from "react";
// import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PostboxPage() {
  const [message, setMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [sent, setSent] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [location, setLocation] = useState<string>("");
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Fetch weather
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`,
            );
            const data = await response.json();
            setWeather(data.current);

            // Fetch location name using reverse geocoding
            const locationResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  "User-Agent": "PostcardApp",
                },
              },
            );
            const locationData = await locationResponse.json();
            const city =
              locationData.address?.city ||
              locationData.address?.town ||
              locationData.address?.county ||
              "Unknown";
            const country = locationData.address?.country || "";
            setLocation(`${city}, ${country}`);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoadingWeather(false);
            setLoadingLocation(false);
          }
        },
        () => {
          // If geolocation fails, try IP-based lookup
          fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
              fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${data.latitude}&longitude=${data.longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit`,
              )
                .then((res) => res.json())
                .then((weatherData) => setWeather(weatherData.current))
                .catch((err) => console.error("Error:", err))
                .finally(() => setLoadingWeather(false));

              // Set location from IP data
              const city = data.city || data.region || "Unknown";
              const country = data.country_name || "";
              setLocation(`${city}, ${country}`);
              setLoadingLocation(false);
            })
            .catch((err) => {
              console.error("Error:", err);
              setLoadingWeather(false);
              setLoadingLocation(false);
            });
        },
      );
    }
  }, []);

  const getWeatherEmoji = (weatherCode: number) => {
    if (weatherCode === 0) return "Sunny";
    if (weatherCode === 1 || weatherCode === 2) return "Mainly Clear";
    if (weatherCode === 3) return "Overcast";
    if (weatherCode === 45 || weatherCode === 48) return "Foggy";
    if (weatherCode >= 51 && weatherCode <= 67) return "Drizzle/Rain";
    if (weatherCode >= 71 && weatherCode <= 85) return "Snow";
    if (weatherCode >= 80 && weatherCode <= 82) return "Showers";
    if (weatherCode >= 85 && weatherCode <= 86) return "Snow showers";
    if (weatherCode >= 80 && weatherCode <= 99) return "Thunderstorm";
    return "Partly Cloudy";
  };

  const handleSendPostcard = () => {
    if (message.trim()) {
      setSent(true);
      setTimeout(() => {
        setMessage("");
        setRecipientName("");
        setSent(false);
      }, 2000);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-8 justify-center items-center">
      <div className="w-full max-w-2xl flex justify-start mb-4">
        <Link href="/protected">
          <Button variant="outline" className="gap-2">
            ← Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <h1 className="text-4xl font-bold">Create a Postcard</h1>
        <p className="text-muted-foreground">
          Share your travel moments with friends and family
        </p>
      </div>

      <div className="w-full max-w-2xl">
        {/* Postcard Container */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-2xl aspect-video flex overflow-hidden">
          {/* Left Side - Message Area */}
          <div className="w-3/5 p-8 border-r-4 border-dashed border-orange-200 flex flex-col justify-between">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here... Share your travel experiences!"
                className="w-full h-full p-4 bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none border-2 border-orange-200 rounded"
              />
            </div>
            <div className="pt-4">
              {loadingWeather ? (
                <div className="text-sm text-gray-600">Getting weather...</div>
              ) : weather ? (
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getWeatherEmoji(weather.weather_code)}
                    </span>
                    <div>
                      <div className="font-semibold">
                        {Math.round(weather.temperature_2m)}°F
                      </div>
                      <div className="text-xs">
                        Wind: {Math.round(weather.wind_speed_10m)} mph
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">Weather unavailable</div>
              )}
            </div>
          </div>

          {/* Right Side*/}
          <div className="w-2/5 p-6 flex flex-col justify-between items-center">
            {/* Stamp */}
            <div className="w-12 h-12 border-4 border-red-100 rounded-sm shadow-md flex items-center justify-center bg-red-50">
              <span className="text-2xl"></span>
            </div>

            <div className="w-full space-y-3 flex-1 flex flex-col justify-center">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  TO:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Name"
                  className="w-full text-xs p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="text-xs text-gray-600 text-center font-semibold mt-2 line-clamp-2 max-w-[80px]">
              {loadingLocation
                ? "Getting location..."
                : location || "Location unknown"}
            </div>
          </div>
        </Card>

        {/* Send Button */}
        <div className="w-full flex justify-center mt-8">
          <Button
            onClick={handleSendPostcard}
            disabled={!message.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg text-lg font-semibold"
          >
            {sent ? "✓ Postcard Sent!" : "Send Postcard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
