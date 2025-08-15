// import React from 'react';
import "../styles/WeatherCard.css";

export const WeatherCard = (props) => {
  return (
    <div className="weather-widget">
      <div className="weather-main">
        <div className="weather-header">
          <h2 className="city-name">{props.city}</h2>
          <div className="weather-desc">{props.forecast}</div>
        </div>

        <div className="weather-temp">
          <span className="temp-main">{Math.round(props.temperature)}°</span>
          <div className="temp-range">
            <span className="temp-min">{Math.round(props.minTemp)}°</span>
            <span className="temp-max">{Math.round(props.maxTemp)}°</span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          {/* <i className="fa-solid fa-temperature-three-quarters"></i> */}
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{Math.round(props.realFeel)}°C</span>
        </div>
        <div className="detail-item">
          {/* <i className="fa-solid fa-droplet"></i> */}
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{props.humidity}%</span>
        </div>
        <div className="detail-item">
          {/* <i className="fa-solid fa-wind"></i> */}
          <span className="detail-label">Wind</span>
          <span className="detail-value">{props.windSpeed} km/h</span>
        </div>
        <div className="detail-item">
          {/* <i className="fa-solid fa-gauge-high"></i> */}
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{props.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};
