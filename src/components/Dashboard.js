// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [roboticData, setRoboticData] = useState(null);

  useEffect(() => {
    axios.get("/api/data") // Assuming your backend server serves data at this endpoint
      .then((response) => {
        setRoboticData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Robotic System Dashboard</h1>
      {roboticData && (
        <div>
          <p>Battery Level: {roboticData.batteryLevel}%</p>
          <p>Operational Status: {roboticData.operationalStatus}</p>
          <h2>Recent Activity Logs:</h2>
          <ul>
            {roboticData.activityLogs.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
