import { Axios } from 'axios'
import { WeatherApiArgs, WeatherLocationApiArgs } from '../utils/types'

const geoApiBaseUrl = 'http://api.openweathermap.org/geo/1.0'
const weatherApiBaseUrl = 'https://api.openweathermap.org/data/2.5'

const weatherAxios = new Axios({
  baseURL: weatherApiBaseUrl,
})
const geoAxios = new Axios({
  baseURL: geoApiBaseUrl,
})

const weatherLocation = async (locationArgs: WeatherLocationApiArgs) => {
  try {
    const locationResponse = await geoAxios.get('/direct', {
      params: { q: locationArgs.locationName, limit: locationArgs.limit, appid: locationArgs.ApiToken },
    })

    console.log(locationResponse.data)
  } catch (e: any) {
    console.error('Error Name: ', e.name, '\nError Message: ', e.message)
  }
}

const getWeatherInformation = async (weatherArgs: WeatherApiArgs) => {
  try {
    const weatherResponse = await weatherAxios.get('/weather', {
      params: { lat: weatherArgs.latitude, lon: weatherArgs.longitude, appid: weatherArgs.ApiToken },
    })

    console.log(weatherResponse.data)
  } catch (e: any) {
    console.error('Error Name: ', e.name, '\nError Message: ', e.message)
  }
}

export { weatherLocation, getWeatherInformation }
