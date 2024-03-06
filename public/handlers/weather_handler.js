/* ./handlers/weather_handler.js */
const express = require('express');
const axios = require('axios').default;
const router = express.Router();
require('dotenv').config()
const sqlite3 = require('sqlite3').verbose();

const weather_key = process.env.OPENWEATHER_API
const google_key = process.env.GOOGLE_API

// TODO: 1. Implement saving as CSV.
// TODO 2. Implement sending weather data as a SMS.
// TODO 3. Implement saving weather data to the database. DONE




router.post("/weather_handle", async (req, res) => {
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const form_box = req.body.location_input_box;

    const handleError = () => res.render("error.ejs");

    if (lat) {
        try {
            const response = await fetch_weather_data(lat, lon);
            const weatherData = extract_weather_data(response.data);
            res.render("weather_results.ejs", { weatherData });
            const db = openDatabase(); // Open the database
            db.run('INSERT INTO weather (location, temperature, feels_like, humidity, conditions, detailed_conditions) VALUES (?, ?, ?, ?, ?, ?)', [weatherData.location_name, weatherData.temp, weatherData.feels_like, weatherData.humidity, weatherData.conditions, weatherData.detailed_conditions], function(err) {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`A new row has been inserted with ID ${this.lastID}`);
                    closeDatabase(db); // Close the database when done
                }
            });
        } catch (error) {
            handleError();
            console.error(error);
        }
    } else if (form_box) {
        const postal_zip_code_regex = /^[A-Za-z0-9\s-]+$/;
        let lat, lon;

        if (postal_zip_code_regex.test(form_box)) {
            try {
                const response = await fetch_geocoding_zipcode(form_box);
                lat = response.data.results[0].geometry.location.lat;
                lon = response.data.results[0].geometry.location.lng;
            } catch (error) {
                handleError();
                console.log(error);
            }
        } else {
            try {
                const response = await fetch_geocoding(form_box);
                lat = response.data[0].lat;
                lon = response.data[0].lon;
            } catch (error) {
                handleError();
                console.log(error);
            }
        }

        try {
            const response = await fetch_weather_data(lat, lon);
            const weatherData = extract_weather_data(response.data);
            res.render("weather_results.ejs", { weatherData });
            const db = openDatabase(); // Open the database

            db.run('INSERT INTO weather (location, temperature, feels_like, humidity, conditions, detailed_conditions) VALUES (?, ?, ?, ?, ?, ?)', [weatherData.location_name, weatherData.temp, weatherData.feels_like, weatherData.humidity, weatherData.conditions, weatherData.detailed_conditions], function(err) {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(`A new row has been inserted with ID ${this.lastID}`);
                    closeDatabase(db); // Close the database when done
                }
            });
        } catch (error) {
            handleError();
            console.error(error);
        }
    }
});

const extract_weather_data = (data) => {
    return {
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        location_name: data.name,
        humidity: data.main.humidity,
        conditions: data.weather[0].main,
        detailed_conditions: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
    };
};

function openDatabase() {
    const db = new sqlite3.Database("./public/db/data.db");

    db.run(`CREATE TABLE IF NOT EXISTS weather (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT,
        temperature INTEGER,
        feels_like INTEGER,
        humidity INTEGER,
        conditions TEXT,
        detailed_conditions TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    return db;
}
function closeDatabase(db) {
    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database closed.');
        }
    });
}
const fetch_geocoding = (form_box) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${form_box}&limit=5&appid=${weather_key}`;
    return axios.get(url)
}

const fetch_geocoding_zipcode = (form_box) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${form_box}&key=${google_key}`;
    return axios.get(url)
}

const fetch_weather_data = (lat, lon, meas_choice) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_key}&units=imperial`;
    return axios.get(url);
};

module.exports = router;
