const { fetchWeatherApi } = require('openmeteo');

async function getWeatherData(latitude, longitude) {
    let latitude_ = latitude;
    let longitude_ = longitude;
    try {
        const params = {
            "latitude": latitude_,
            "longitude": longitude_,
            "daily": ["weather_code", "apparent_temperature_max", "apparent_temperature_min", "sunshine_duration"]
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        
        // Helper function to form time ranges
        const range = (start, stop, step) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
        
        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];
        
        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const latitude = response.latitude();
        const longitude = response.longitude();
        
        console.log("Lat: " + latitude + ", Long: " + longitude);
        const daily = response.daily();
        
        // Note: The order of weather variables in the URL query and the indices below need to match!
        console.log(daily.variables(2).valuesArray())
        const weatherData = {
        
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                weatherCode: daily.variables(0).valuesArray(),
                apparentTemperatureMax: daily.variables(1).valuesArray(),
                apparentTemperatureMin: daily.variables(2).valuesArray(),
                sunshineDuration: daily.variables(3).valuesArray(),
            },
        
        };
        
        let dates = [];
        let weatherCodes = [];
        let minTemps = [];
        let maxTemps = [];
        let sunshineHours = [];
        let energy = [];

        for (let i = 0; i < weatherData.daily.time.length; i++) {
            let date = weatherData.daily.time[i].toISOString().substring(0, 10).split('-').reverse().join('/')
            let weatherCode = weatherData.daily.weatherCode[i];
            let minTemp =  Math.round(weatherData.daily.apparentTemperatureMin[i]);
            let maxTemp = Math.round(weatherData.daily.apparentTemperatureMax[i]);
            let sunHours = weatherData.daily.sunshineDuration[i] / 3600; 

            dates.push(date);
            weatherCodes.push(weatherCode);
            minTemps.push(minTemp);
            maxTemps.push(maxTemp);
            sunshineHours.push(sunHours);

            const power = 2.5;
            const efficiency = 0.2;
            energy.push((sunHours * power * efficiency).toFixed(2));

            // console.log(
            //     date,
            //     weatherCode,
            //     minTemp,
            //     maxTemp,
            //     energy[i]
            // );
        }
        return {
            "dates": dates, 
            "weatherCodes":weatherCodes, 
            "minTemps": minTemps, 
            "maxTemps": maxTemps, 
            "energy": energy
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}

module.exports = { getWeatherData };
