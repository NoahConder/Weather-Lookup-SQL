/* ./handlers/geocoding_handler.js */
const express = require('express');
const axios = require('axios').default;
const router = express.Router();

require('dotenv').config()
const weather_key = process.env.OPENWEATHER_API

router.get('/autocomplete', (req, res) => {
    const query = req.query.query; // Get the location query from the request URL parameter

    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${weather_key}`;

    axios.get(apiUrl)
        .then((response) => {
            const data = response.data;
            res.json(data); // Send the weather data back to the client as a JSON response
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'An error occurred while fetching weather data.' });
        });
});

module.exports = router;
