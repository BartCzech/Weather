const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { getWeatherData } = require('./getWeatherData'); 

exports.getWeatherData = [
  // sanitization
  body("latitude")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Latitude must be specified.")
  .matches(/^[-]?\d{1,2}(?:\.\d{1,6})?$/)
  .withMessage("Latitude must be a valid decimal number with up to 6 decimal places.")
  .custom((value) => {
    const latitude = parseFloat(value);
    if (latitude < -90 || latitude > 90) {
      throw new Error("Latitude must be between -90 and 90 degrees.");
    }
    return true;
  })
  .escape(),
  body("longitude")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Longitude must be specified.")
  .matches(/^[-]?\d{1,3}(?:\.\d{1,6})?$/)
  .withMessage("Longitude must be a valid decimal number with up to 6 decimal places.")
  .custom((value) => {
    const longitude = parseFloat(value);
    if (longitude < -180 || longitude > 180) {
      throw new Error("Longitude must be between -180 and 180 degrees.");
    }
    return true;
  })
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