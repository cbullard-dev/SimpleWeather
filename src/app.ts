// Define variables
import express from 'express'
import axios from 'axios'
import slack from './slack'
import data from './datastore'

// Create express app
const app = express()

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
function log(message: string) {
  console.log(message)
}

// Error log function
function errorLog(errorMessage: string) {
  console.error(errorMessage)
}

// Function to get location based on city, state and country
async function GetLocation(location) {
  // Try to get the location based on the City, State and Country provided
  try {
    const query: string[] = []
    const params = new URLSearchParams()
    if (location.cityName) query.push(location.cityName)
    if (location.stateCode) query.push(location.stateCode)
    if (location.countryCode) query.push(location.countryCode)

    if (query.length >= 1) {
      params.append('q', query.join(','))
    }

    if (typeof process.env.API_TOKEN !== 'string') return
    params.append('appid', process.env.API_TOKEN)

    const response = await weatherGeo.get('/direct?' + params.toString())

    log(response.data)

    let locationLatLong = {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
    }
    return locationLatLong
  } catch (e: any) {
    if (!e.hasOwnProperty('response')) {
      console.log(e.response)
    } else {
      console.log(e)
    }
  }
}

async function GetWeatherTwo(location: string) {
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
