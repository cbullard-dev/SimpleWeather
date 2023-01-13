// @ts-nocheck
import { App, Installation, LogLevel } from '@slack/bolt'
import { appHome, appHomeNoToken } from './views/apphome'
import { user } from 'slack-block-builder'
import { add_weather_token } from './views/modals'
import axios from 'axios'

let slackPort: number

if (typeof process.env.PORT === 'string') {
  slackPort = parseInt(process.env.PORT)
} else {
  slackPort = 3000
}

const databaseData = {}
const database = {
  set: async (key: string, data: Installation<AuthVersion, Boolean>) => {
    databaseData[key] = data
    console.log('Added Database Element: ', databaseData)
  },
  get: async (key: string) => {
    console.log('Return Database Element: ', databaseData)
    return databaseData[key]
  },
  delete: async (key: string) => {
    delete databaseData[key]
  },
}

const userTokenData = {}
const userTokenDatabase = {
  set: async (userId: string, userToken: string) => {
    userTokenData[userId] = userToken
    console.log(userTokenData)
  },
  get: async (userId: string) => {
    console.log(userTokenData[userId])
    return userTokenData[userId]
  },
  delete: async (userId: string) => {
    console.log('Deleting data ', userTokenData[userId])
    delete userTokenData[userId]
  },
}

// For Dev environment only
const slackApp = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_SOCKET_TOKEN,
  socketMode: true,
})

// ToDo: Use this for production environment
// const slackApp = new App({
//   logLevel: LogLevel.DEBUG,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
//   clientId: process.env.SLACK_CLIENT_ID,
//   clientSecret: process.env.SLACK_CLIENT_SECRET,
//   stateSecret: 'my-state-secret',
//   scopes: ['chat:write'],
//   installationStore: {
//     storeInstallation: async (installation) => {
//       // change the line below so it saves to your database
//       if (
//         installation.isEnterpriseInstall &&
//         installation.enterprise !== undefined
//       ) {
//         // support for org wide app installation
//         return await database.set(installation.enterprise.id, installation)
//       }
//       if (installation.team !== undefined) {
//         // single team app installation
//         return await database.set(installation.team.id, installation)
//       }
//       throw new Error('Failed saving installation data to installationStore')
//     },
//     fetchInstallation: async (installQuery) => {
//       // change the line below so it fetches from your database
//       if (
//         installQuery.isEnterpriseInstall &&
//         installQuery.enterpriseId !== undefined
//       ) {
//         // org wide app installation lookup
//         return await database.get(installQuery.enterpriseId)
//       }
//       if (installQuery.teamId !== undefined) {
//         // single team app installation lookup
//         return await database.get(installQuery.teamId)
//       }
//       throw new Error('Failed fetching installation')
//     },
//     deleteInstallation: async (installQuery) => {
//       // change the line below so it deletes from your database
//       if (
//         installQuery.isEnterpriseInstall &&
//         installQuery.enterpriseId !== undefined
//       ) {
//         // org wide app installation deletion
//         return await database.delete(installQuery.enterpriseId)
//       }
//       if (installQuery.teamId !== undefined) {
//         // single team app installation deletion
//         return await database.delete(installQuery.teamId)
//       }
//       throw new Error('Failed to delete installation')
//     },
//   },
//   installerOptions: {
//     // If this is true, /slack/install redirects installers to the Slack authorize URL
//     // without rendering the web page with "Add to Slack" button.
//     // This flag is available in @slack/bolt v3.7 or higher
//     // directInstall: true,
//   },
// })

slackApp.event('app_home_opened', async ({ event, client, logger }) => {
  try {
    const res = await client.views.publish({
      user_id: event.user,
      view: appHomeNoToken(),
    })

    logger.info(res)
  } catch (e) {
    logger.error(e)
  }
})

slackApp.action(
  'open_settings',
  async ({ ack, body, action, client, logger }) => {
    try {
      await ack()
      const modalOpen = await client.views.open({
        trigger_id: body.trigger_id,
        view: add_weather_token(),
      })
      logger.info(modalOpen)
    } catch (e) {
      logger.error(e)
    }
  }
)

slackApp.view(
  'add_open_weather_token',
  async ({ ack, respond, view, body, context, action, client, logger }) => {
    try {
      // logger.info('Body: ', body.user.id)
      userTokenDatabase.set(
        body.user.id,
        view.state.values.open_weather_input.api_token_text_input.value
      )
      await ack()
      const weatherToken = await userTokenDatabase.get(body.user.id)
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${weatherToken}`
      logger.debug(weatherUrl)
      const weather = await axios.get(weatherUrl)
      logger.info(weather.data)
      await client.views.publish({
        user_id: body.user.id,
        view: appHome(weather, {}),
      })
    } catch (e) {
      logger.error(e)
    }
  }
)

// start the Slack app
;(async () => {
  await slackApp.start(process.env.PORT || 4000)

  console.log('⚡️ Bolt app is running!')
})()
