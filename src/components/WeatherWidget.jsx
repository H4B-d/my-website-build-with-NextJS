import React, { useEffect, useState } from "react";
import styles from "./WeatherWidget.module.css";

export default function WeatherWidget() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState("Loading...");

  // --- Helper: weather code → icon + description ---
  const weatherCodeToInfo = (code, isoTime) => {
    const night = (() => {
      const hours = new Date(isoTime).getHours();
      return hours < 6 || hours >= 19;
    })();

    const map = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      99: "Thunderstorm with hail",
    };

    let icon = "🌈";
    switch (true) {
      case [0, 1].includes(code): icon = night ? "🌙" : "☀️"; break;
      case [2, 3].includes(code): icon = night ? "🌙☁️" : "🌤️"; break;
      case [45, 48].includes(code): icon = "🌫️"; break;
      case [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code): icon = "🌧️"; break;
      case [71, 73, 75].includes(code): icon = "❄️"; break;
      case [95, 99].includes(code): icon = "⛈️"; break;
      default: icon = "🌈";
    }

    return { icon, desc: map[code] || "Unknown" };
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // --- Load current weather + forecast ---
  const loadWeather = async (lat, lon, place) => {
    try {
      setLoading("Loading...");
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const res = await fetch(url);
      const json = await res.json();

      const w = json.current_weather;
      if (!w) throw new Error("No data");

      const { icon, desc } = weatherCodeToInfo(w.weathercode, w.time);
      setData({
        temp: w.temperature,
        wind: w.windspeed,
        desc,
        icon,
        time: formatTime(w.time),
        place,
      });

      const daily = json.daily;
      const next3Days = daily.time.slice(1, 4).map((date, i) => {
        const code = daily.weathercode[i + 1];
        const { icon: fIcon, desc: fDesc } = weatherCodeToInfo(code, date);
        return {
          date: new Date(date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
          }),
          min: daily.temperature_2m_min[i + 1],
          max: daily.temperature_2m_max[i + 1],
          icon: fIcon,
          desc: fDesc,
        };
      });
      setForecast(next3Days);

      setLoading(null);
    } catch {
      setLoading("Unable to fetch weather data.");
    }
  };

  // --- Search city ---
  const fetchCityWeather = async (cityName) => {
    try {
      setLoading(`Searching for "${cityName}"...`);
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cityName
        )}&count=1&language=en`
      );
      const data = await geo.json();
      if (!data.results?.length) throw new Error("City not found");
      const loc = data.results[0];
      const place = [loc.name, loc.admin1, loc.country].filter(Boolean).join(", ");
      await loadWeather(loc.latitude, loc.longitude, place);
    } catch {
      setLoading("City not found or error fetching data.");
    }
  };

  // --- On load: use geolocation ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          loadWeather(
            pos.coords.latitude,
            pos.coords.longitude,
            "Current location"
          ),
        () =>
          setLoading("Unable to get location. Please enter a city name.")
      );
    } else setLoading("Geolocation not supported.");
  }, []);

  return (
    <div className={styles.card + " " + styles.weatherWidget}>
      <h2>🌦️ Weather Forecast</h2>
      <p className={styles.muted}>
        Check the weather at your current location or search by city.
      </p>

      <div className={styles.weatherSearch}>
        <input
          type="text"
          placeholder="Enter a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && city && fetchCityWeather(city)} // ✅ Enter key
        />
        <button onClick={() => city && fetchCityWeather(city)}>Search</button>
      </div>

      <div className={styles.widgetBox}>
        {loading ? (
          <div className={styles.weatherLoading}>
            <div className={styles.spinner}></div>
            <p>{loading}</p>
          </div>
        ) : (
          data && (
            <>
              <div className={styles.weatherMain}>
                <div className={styles.weatherIcon}>{data.icon}</div>
                <div className={styles.weatherTemp}>{data.temp}°C</div>
                <div className={styles.weatherDesc}>{data.desc}</div>
                <div className={styles.weatherMeta}>
                  📍 {data.place}
                  <br />
                  💨 Wind: {data.wind} m/s
                  <br />
                  🕒 Last updated: {data.time}
                </div>
              </div>

              {/* --- 3-day forecast --- */}
              {forecast.length > 0 && (
                <div className={styles.forecast}>
                  <h3>Next 3 Days</h3>
                  <div className={styles.forecastGrid}>
                    {forecast.map((f, i) => (
                      <div key={i} className={styles.forecastItem}>
                        <div className={styles.forecastDate}>{f.date}</div>
                        <div className={styles.forecastIcon}>{f.icon}</div>
                        <div className={styles.forecastTemp}>
                          {f.min}°C – {f.max}°C
                        </div>
                        <div className={styles.forecastDesc}>{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}



