/* ./routes/weather.js */
const express = require('express');
const router = express.Router();

router.get("/weather", function (req, res) {
    res.render("weather.ejs");

});
module.exports = router;
