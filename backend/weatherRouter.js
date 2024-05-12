const express = require("express");
const router = express.Router();

const weather_controller = require("./weatherController");

router.post("/", weather_controller.getWeatherData);

module.exports = router;