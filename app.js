const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const app = new express();

const weather = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 10000,
});

const weatherGeo = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0/",
  timeout: 10000,
});

function log(message) {
  console.log(message);
}

function errorLog(errorMessage) {
  console.error(errorMessage);
}

async function GetLocation(cityName, stateCode, countryCode) {
  // Try to get the location based on the City, State and Country provided
  try {
    const query = [];
    const params = new URLSearchParams();
    if (cityName !== undefined) query.push(cityName);
    if (stateCode !== undefined) query.push(stateCode);
    if (countryCode !== undefined) query.push(countryCode);

    if (query.length >= 1) {
      params.append("q", query.join(","));
    }

    params.append("appid", process.env.API_TOKEN);

    const response = await weatherGeo.get("/direct?" + params.toString());

    let locationLatLong = {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
    };
    return locationLatLong;
  } catch (error) {
    if (!error.hasOwnProperty("response")) {
      console.log(error.response);
    } else {
      console.log(error);
    }
  }
}

async function GetWeather(locationData) {
  // Define variables
  const params = new URLSearchParams();
  const forecast_data = {};

  // Add URL Search Params
  params.append("lat", locationData.lat);
  params.append("lon", locationData.lon);
  params.append("units", "metric");
  params.append("appid", process.env.API_TOKEN);

  // Try get the information from the Open Weather API
  try {
    const response = await weather.get("/forecast?" + params);
    if (response.hasOwnProperty("data")) {
      forecast_data.forecast_for = response.data.city.name;
      forecast_data.forecast = [];
      // log("Forecast for: " + response.data.city.name);
      response.data.list.forEach((element) => {
        if (element.dt_txt.includes("09:00:00")) {
          forecast_data.forecast.push({
            date: element.dt_txt,
            weather_description: element.weather[0].description,
            temp: `${element.main.temp}°c`,
          });
        }
      });
      return forecast_data;
    } else {
      throw new Error("No forecast data in response");
    }
  } catch (error) {
    errorLog(error);
  }
}

async function main() {
  const location = await GetLocation(undefined, "New South Wales", "Australia");

  if (location !== undefined) {
    const forecastData = await GetWeather(location);
  }
}

app.get("/", async (req, res) => {
  res.sendStatus(200);
});

app.get("/forecast", async (req, res) => {
  try {
    // Currently hard coding Location
    const location = await GetLocation(
      undefined,
      "New South Wales",
      "Australia"
    );

    if (location !== undefined) {
      const forecastData = await GetWeather(location);
      res.status(200).send(forecastData);
    } else {
      res.sendStatus(408);
    }
  } catch (error) {
    res.stateCode(408);
  }
});

const server = app.listen(process.env.PORT || 8080, () => {
  let address = server.address().address;
  if (address === "::") address = "localhost";
  let port = server.address().port;

  log(`Server started at address http://${address}:${port}`);
});
