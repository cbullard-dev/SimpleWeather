const express = require('express')
const router = express.Router()
const ax = require('axios')
const appHome = require('./views/home')
const modals = require('./views/modals')
const messages = require('./views/messages')
const helper = require('./helpers')
const data = require('./datastore')

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
  // If the body contains a challenge respond with the challenge then return
  if (req.body.challenge) {
    res.send(req.body.challenge)
    return
  }

  // If the app home is opened show the user the app home

  if (req.body.event && req.body.event.type === 'app_home_opened') {
    res.sendStatus(200).end()
    try {
      const body = {
        user_id: req.body.event.user,
        view: appHome(undefined, dummy_weather, undefined),
      }
      console.log(body)
      const response = await slack_api.post('/views.publish', body)
    } catch (e) {
      console.error(e.data)
    }
    return
  }

  // If the request body has a payload
  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload)
    const trigger_id = payload.trigger_id
    console.log(payload)

    // If the payload contains the action_id unit_of_measurement_toggle, log out the unit of measurement selected
    if (payload.type && payload.type === 'block_actions') {
      if (payload.actions[0].action_id === 'unit_of_measurement_toggle') {
        const actions = payload.actions[0]
        console.log(
          'User: ' +
            payload.user.id +
            '\nAction: ' +
            actions.selected_option.value
        )
        return
      }

      // If the payload contains the action_id open_settings open the settings menu
      if (payload.actions[0].action_id === 'open_settings') {
        try {
          const body = {
            trigger_id: trigger_id,
            view: modals.settings(),
          }
          // console.log(body)
          const response = await slack_api.post('/views.open', body)
          return
          // console.log(response.data)
        } catch (e) {
          console.error(e)
        }
      }

      // If the payload contains the action_id add_api_token update the current view with the Add Open Weather Token view
      if (payload.actions[0].action_id === 'add_api_token') {
        try {
          const body = {
            trigger_id: trigger_id,
            view: modals.add_weather_token(),
            view_id: payload.view.id,
          }
          const response = await slack_api.post('/views.update', body)
          console.log(response.data)
        } catch (e) {
          console.error(e.data)
        }
      }
    }

    res.sendStatus(200).end()

    return
  }

  // If none of the above happens respond to the server with a 200:OK and log out the request body
  res.send(200).end()
  console.log(req.body)
})

router.post('/test', async (req, res) => {
  res.sendStatus(200).end()
  // try {
  //   const payload = JSON.parse(req.body.payload)
  //   console.log(payload)
  //   const trigger_id = payload.trigger_id
  //   const body = {
  //     trigger_id: trigger_id,
  //     view: modals.settings(),
  //   }
  //   // console.log(body)
  //   const response = await slack_api.post('/views.open', body)
  //   // console.log(response.data)
  // } catch (e) {
  //   console.error(e)
  // }
})

module.exports = router
