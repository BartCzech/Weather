const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const weatherRouter = require("./weatherRouter");
const { getWeatherData } = require('./weatherController'); 

const app = express();
dotenv.config();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/weather", weatherRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
