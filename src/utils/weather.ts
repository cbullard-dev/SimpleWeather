import { Axios } from 'axios'

const geoApiBaseUrl = 'http://api.openweathermap.org/geo/1.0'
const weatherApiBaseUrl = 'https://api.openweathermap.org/data/2.5'

const weatherAxios = new Axios({
  baseURL: weatherApiBaseUrl,
})
const geoAxios = new Axios({
  baseURL: geoApiBaseUrl,
})

const weatherLocation = async (locationName: string, token: string, limit?: number | 5) => {
  geoAxios.get('/direct', { params: { q: locationName, limit: limit, appid: token } })
}
