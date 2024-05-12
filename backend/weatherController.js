const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { getWeatherData } = require('./getWeatherData'); 

exports.getWeatherData = [
  // sanitization
  body("latitude")
    .trim()
    .isLength({ min: 1 })
    .matches(/^[\d.]+$/) 
    .withMessage("Latitude must contain only numbers and dots.")
    .escape(),
  body("longitude")
    .trim()
    .isLength({ min: 1 })
    .matches(/^[\d.]+$/) 
    .withMessage("Longitude must be specified.")
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Errors occurred. Check res");
        res.send(errors);
        return;
    }
    const result = await getWeatherData(parseFloat(req.body.latitude), parseFloat(req.body.longitude))
    // console.log(result)
    res.json(result);
  }),
];