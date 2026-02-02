import React, { useState, useEffect } from 'react';
import './PageHeader.css';

const PageHeader = ({ title, description, icon = "🚗" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="page-header">
      <div className="header-left">
        <h1>{icon} {title}</h1>
        <p>{description}</p>
      </div>
      <div className="header-right">
        <div className="status-bar">
          <div className="weather-status">
            <span className="weather-emoji">☀️</span>
            <span className="weather-text">28°C Sunny</span>
          </div>
          <div className="time-status">
            <span className="clock-emoji">🕐</span>
            <span className="time-text">{formatTime(currentTime)}</span>
          </div>
          <div className="date-status">
            <span className="calendar-emoji">📅</span>
            <span className="date-text">{formatDate(currentTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;