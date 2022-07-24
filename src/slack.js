const express = require('express')
const router = express.Router()
const ax = require('axios')
const { appHome, appHomeNoToken } = require('../views/home')
const
const helper = require('./helpers')

const slack_api = ax.create({
  baseURL: 'https://slack.com/api',
  headers: { Authorization: 'Bearer ' + process.env.SLACK_BOT_TOKEN },
})

const dummy_weather = {
  coord: {
    lon: -122.08,
    lat: 37.39,
  },
  weather: [
    {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  base: 'stations',
  main: {
    temp: 282.55,
    feels_like: 281.86,
    temp_min: 280.37,
    temp_max: 284.26,
    pressure: 1023,
    humidity: 100,
  },
  visibility: 10000,
  wind: {
    speed: 1.5,
    deg: 350,
  },
  clouds: {
    all: 1,
  },
  dt: 1560350645,
  sys: {
    type: 1,
    id: 5122,
    message: 0.0139,
    country: 'US',
    sunrise: 1560343627,
    sunset: 1560396563,
  },
  timezone: -25200,
  id: 420006353,
  name: 'Mountain View',
  cod: 200,
  emoji: '',
}
dummy_weather.emoji = helper(dummy_weather.weather[0].description)

router.post('/events', async (req, res) => {
  if (req.body.challenge) res.send(req.body.challenge)
  if (req.body.event.type === 'app_home_opened') {
    res.sendStatus(200).end()
    try {
      const body = {
        user_id: req.body.event.user,
        view: appHome(undefined, dummy_weather, undefined),
      }
      console.log(body)
      const response = await slack_api.post('/views.publish', body)
      console.log(response.data)
    } catch (e) {
      console.error(e.data)
    }
    return
  }
  res.send(200).end()
  console.log(req.body)
})

router.get('/test', async (req, res) => {
  try {
    const body = {
      user_id: req.query.user_id,
      view: 
    }
  } catch (e) {}
})

module.exports = router
