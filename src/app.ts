// Define variables
const express = require('express')
const axios = require('axios')
const slack = require('./slack')
const data = require('./datastore')

// Create express app
const app = new express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/slack', slack)

// Create weather API instance
const weather = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

// Create weather location API instance
const weatherGeo = axios.create({
  baseURL: 'https://api.openweathermap.org/geo/1.0/',
  timeout: 10000,
})

// Log function
function log(message) {
  console.log(message)
}

// Error log function
function errorLog(errorMessage) {
  console.error(errorMessage)
}

// Function to get location based on city, state and country
async function GetLocation(cityName, stateCode, countryCode) {
  // Try to get the location based on the City, State and Country provided
  try {
    const query = []
    const params = new URLSearchParams()
    if (cityName !== undefined) query.push(cityName)
    if (stateCode !== undefined) query.push(stateCode)
    if (countryCode !== undefined) query.push(countryCode)

    if (query.length >= 1) {
      params.append('q', query.join(','))
    }

    params.append('appid', process.env.API_TOKEN)

    const response = await weatherGeo.get('/direct?' + params.toString())

    log(response.data)

    let locationLatLong = {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
    }
    return locationLatLong
  } catch (error) {
    if (!error.hasOwnProperty('response')) {
      console.log(error.response)
    } else {
      console.log(error)
    }
  }
}

async function GetWeatherTwo(location) {
  const params = new URLSearchParams()
  const forecast_data = {}

  params.append('q', location)
  params.append('units', 'metric')
  params.append('appid', process.env.API_TOKEN)

  try {
    const response = await weather.get('/find?' + params)
    log(response.data)
  } catch (e) {
    errorLog(e.response.data)
  }
}

// Get the weather based on location data
async function GetWeather(locationData) {
  // Define variables
  const params = new URLSearchParams()
  const forecast_data = {}

  // Add URL Search Params
  params.append('lat', locationData.lat)
  params.append('lon', locationData.lon)
  params.append('units', 'metric')
  params.append('appid', process.env.API_TOKEN)

  // Try get the information from the Open Weather API
  try {
    const response = await weather.get('/forecast?' + params)
    if (response.hasOwnProperty('data')) {
      forecast_data.forecast_for = response.data.city.name
      forecast_data.forecast = []
      response.data.list.forEach((element) => {
        if (element.dt_txt.includes('09:00:00')) {
          // console.log(element)
          forecast_data.forecast.push(element)
        }
      })
      return forecast_data
    } else {
      throw new Error('No forecast data in response')
    }
  } catch (error) {
    errorLog(error)
  }
}

app.get('/', async (req, res) => {
  console.log(data.add_user({ user_id: 'test', team_id: 'abcd' }))
  res.sendStatus(200).end()
})

app.get('/forecast', async (req, res) => {
  // Define variables
  const city = req.query.city
  const state = req.query.state
  const country = req.query.country

  try {
    // Currently hard coding Location
    const location = await GetLocation(city, state, country)

    if (location !== undefined) {
      const forecastData = await GetWeather(location)
      res.status(200).send(forecastData)
    } else {
      res.sendStatus(408)
    }
  } catch (error) {
    res.stateCode(408)
  }
})

slack.post

const server = app.listen(process.env.PORT || 8080, () => {
  let address = server.address().address
  if (address === '::') address = 'localhost'
  let port = server.address().port

  log(`Server started at address http://${address}:${port}`)
  log(`Do you need to change your ngrok URL?`)
})
