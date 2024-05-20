const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// Simulated data for the robotic system
let batteryData = {
    level: 80,
    health: 'Good',
    chargingStatus: 'Not Charging'
};

let operationalData = {
    status: 'active',
    mode: 'autonomous',
    speed: '1.2 m/s',
    location: {
        latitude: 37.7749,
        longitude: -122.4194
    }
};

let activityLogs = [
    'Started routine maintenance at 10:00 AM',
    'Completed task A at 10:30 AM',
    'Charging initiated at 11:00 AM',
    'Charging completed at 12:00 PM',
    'Resumed task B at 12:15 PM'
];

// Simulate real-time updates
setInterval(() => {

    batteryData.level = Math.max(0, batteryData.level - Math.random() * 2);


    operationalData.speed = (Math.random() * 3).toFixed(2) + ' m/s';

    // Add new activity log
    const currentTime = new Date().toLocaleTimeString();
    activityLogs.push(`Activity at ${currentTime}`);

    // Keep only the last 5 activity logs
    if (activityLogs.length > 5) {
        activityLogs = activityLogs.slice(-5);
    }
}, 5000); // Update every 5 seconds

// API endpoint to fetch all data
app.get('/api/data', (req, res) => {
    res.json({
        battery: batteryData,
        operational: operationalData,
        activities: activityLogs
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
