// backend/server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const data = {
    batteryLevel: 80,
    operationalStatus: 'active',
    activityLogs: ['Activity 1', 'Activity 2', 'Activity 3']
};

app.get('/api/data', (req, res) => {
    try {
        res.json(data);
        console.log(lol)
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
