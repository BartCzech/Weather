import React, { useState, useEffect } from "react";
import "./App.css";
import Location from './Location';
import { ReactComponent as SunSolidIcon } from "./icons/sun-solid.svg";
import { ReactComponent as CloudSunSolidIcon } from "./icons/cloud-sun-solid.svg";
import { ReactComponent as FogSolidIcon } from "./icons/fog-solid.svg";
import { ReactComponent as CloudSolidIcon } from "./icons/cloud-solid.svg";
import { ReactComponent as CloudRainSolidIcon } from "./icons/cloud-rain-solid.svg";
import { ReactComponent as SnowflakeSolidIcon } from "./icons/snowflake-solid.svg";
import { ReactComponent as CloudBoltSolidIcon } from "./icons/cloud-bolt-solid.svg";

const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      });
      const data = await response.json();
      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const getWeatherIcon = (code) => {
    switch (code) {
      case 0:
      case 1:
      case 2:
        return <SunSolidIcon className="weather-icon" key="sun" />;
      case 3:
        return <CloudSunSolidIcon className="weather-icon" key="cloud-sun" />;
      case 45:
      case 48:
        return <FogSolidIcon className="weather-icon" key="fog" />;
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
        return <CloudSolidIcon className="weather-icon" key="cloud" />;
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
        return <CloudRainSolidIcon className="weather-icon" key="cloud-rain" />;
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return <SnowflakeSolidIcon className="weather-icon" key="snowflake" />;
      case 95:
      case 96:
      case 99:
        return <CloudBoltSolidIcon className="weather-icon" key="cloud-bolt" />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1 className="title">Weather Forecast</h1>
      <Location onLocationChange={(latitude, longitude) => fetchWeatherData(latitude, longitude)} />
      <div className="mode-toggle">
        <label className="switch">
          <input type="checkbox" onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
        <span className="mode-label">
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
      <table id="weather-table">
        <thead>
          <tr>
            <th>Date</th>
            {weatherData.dates &&
              weatherData.dates.map((date, index) => (
                <th key={index}>{date}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Weather Code</td>
            {weatherData.weatherCodes &&
              weatherData.weatherCodes.map((code, index) => (
                <td key={index}>{code !== null && getWeatherIcon(code)}</td>
              ))}
          </tr>

          <tr>
            <td>Min Temp (°C)</td>
            {weatherData.minTemps &&
              weatherData.minTemps.map((temp, index) => (
                <td key={index} className="temp-energy">{temp}</td>
              ))}
          </tr>
          <tr>
            <td>Max Temp (°C)</td>
            {weatherData.maxTemps &&
              weatherData.maxTemps.map((temp, index) => (
                <td key={index} className="temp-energy">{temp}</td>
              ))}
          </tr>
          <tr>
            <td>Energy (kWh)</td>
            {weatherData.energy &&
              weatherData.energy.map((energy, index) => (
                <td key={index} className="temp-energy">{energy}</td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
