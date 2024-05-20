// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [view, setView] = useState('battery'); // Default view
    const [timeRange, setTimeRange] = useState(24); // Default time range in hours

    const fetchData = () => {
        axios.get('http://localhost:8000/api/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                setError('Error fetching data');
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        fetchData();
    };

    const handleViewChange = (event) => {
        setView(event.target.value);
    };

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    const batteryChartData = {
        labels: ['Battery Level'],
        datasets: [{
            label: 'Battery Level',
            data: [data.battery.level],
            backgroundColor: ['#36A2EB'],
        }]
    };

    const operationalChartData = {
        labels: ['Speed'],
        datasets: [{
            label: 'Speed (m/s)',
            data: [data.operational.speed],
            backgroundColor: ['#FF6384'],
        }]
    };

    const activityChartData = {
        labels: data.activities.slice(0, timeRange).map((log, index) => `Log ${index + 1}`),
        datasets: [{
            label: 'Activity Logs',
            data: new Array(timeRange).fill(1),
            backgroundColor: ['#FFCE56'],
        }]
    };

    const chartStyle = {
        width: '400px',
        height: '400px',
        margin: '0 auto'
    };

    return (
        <div>
            <h1>Robotic System Dashboard</h1>

            <div>
                <button onClick={handleRefresh}>Refresh Data</button>
            </div>

            <div>
                <label htmlFor="viewSelect">Select View: </label>
                <select id="viewSelect" value={view} onChange={handleViewChange}>
                    <option value="battery">Battery Data</option>
                    <option value="operational">Operational Data</option>
                    <option value="activities">Activity Logs</option>
                </select>
            </div>

            <div>
                <label htmlFor="timeRange">Select Time Range (hours): </label>
                <input
                    id="timeRange"
                    type="range"
                    min="1"
                    max="48"
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                />
                <span>{timeRange} hours</span>
            </div>

            {view === 'battery' && (
                <div>
                    <h2>Battery Data</h2>
                    <p>Battery Level: {data.battery.level}%</p>
                    <p>Battery Health: {data.battery.health}</p>
                    <p>Charging Status: {data.battery.chargingStatus}</p>
                    <div style={chartStyle}>
                        <Doughnut data={batteryChartData} />
                    </div>
                </div>
            )}

            {view === 'operational' && (
                <div>
                    <h2>Operational Data</h2>
                    <p>Status: {data.operational.status}</p>
                    <p>Mode: {data.operational.mode}</p>
                    <p>Speed: {data.operational.speed} m/s</p>
                    <p>Location: {data.operational.location.latitude}, {data.operational.location.longitude}</p>
                    <div style={chartStyle}>
                        <Doughnut data={operationalChartData} />
                    </div>
                </div>
            )}

            {view === 'activities' && (
                <div>
                    <h2>Recent Activity Logs</h2>
                    <ul>
                        {data.activities.slice(0, timeRange).map((log, index) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                    <div style={chartStyle}>
                        <Line data={activityChartData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
