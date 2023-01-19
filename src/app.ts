import { App, Installation, LogLevel } from '@slack/bolt'
import { appHome, appHomeNoToken } from './views/apphome'
import { user } from 'slack-block-builder'
import { openLocationSettingsAction, openSettingsAction, openWeatherTokenSettingsAction } from './modules/events'
import { oauthDatabase, userOptionDatabase, userTokenDatabase } from './database/database'
import { userAddNewToken } from './modules/views'
import axios from 'axios'

let slackPort: number
let slackApp: App

if (typeof process.env.PORT === 'string') {
  slackPort = parseInt(process.env.PORT)
} else {
  slackPort = 3000
}

// For Dev environment only
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  slackApp = new App({
    logLevel: LogLevel.INFO,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_SOCKET_TOKEN,
    socketMode: true,
  })
} else {
  // ToDo: Migrate this to using a real database
  slackApp = new App({
    logLevel: LogLevel.DEBUG,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: 'my-state-secret',
    scopes: ['chat:write'],
    installationStore: {
      storeInstallation: async (installation) => {
        // change the line below so it saves to your database
        if (installation.isEnterpriseInstall && installation.enterprise !== undefined) {
          // support for org wide app installation
          return await oauthDatabase.set(installation.enterprise.id, installation)
        }
        if (installation.team !== undefined) {
          // single team app installation
          return await oauthDatabase.set(installation.team.id, installation)
        }
        throw new Error('Failed saving installation data to installationStore')
      },
      fetchInstallation: async (installQuery) => {
        // change the line below so it fetches from your database
        if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
          // org wide app installation lookup
          return await oauthDatabase.get(installQuery.enterpriseId)
        }
        if (installQuery.teamId !== undefined) {
          // single team app installation lookup
          return await oauthDatabase.get(installQuery.teamId)
        }
        throw new Error('Failed fetching installation')
      },
      deleteInstallation: async (installQuery) => {
        // change the line below so it deletes from your database
        if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
          // org wide app installation deletion
          return await oauthDatabase.delete(installQuery.enterpriseId)
        }
        if (installQuery.teamId !== undefined) {
          // single team app installation deletion
          return await oauthDatabase.delete(installQuery.teamId)
        }
        throw new Error('Failed to delete installation')
      },
    },
    installerOptions: {
      // If this is true, /slack/install redirects installers to the Slack authorize URL
      // without rendering the web page with "Add to Slack" button.
      // This flag is available in @slack/bolt v3.7 or higher
      // directInstall: true,
    },
  })
}

slackApp.event('app_home_opened', async ({ event, client, logger }) => {
  const user = event.user
  const userConfigExists = await userOptionDatabase.exists(user)
  try {
    if (userConfigExists) {
      const res = await client.views.publish({
        user_id: event.user,
        view: appHomeNoToken(),
      })

      logger.info(res)
    } else {
      const res = await client.views.publish({
        user_id: event.user,
        view: appHome({}, {}),
      })

      logger.info(res)
    }
  } catch (e) {
    logger.error(e)
  }
})

slackApp.action('add_open_weather_api_token', openWeatherTokenSettingsAction)

slackApp.action('open_settings', openSettingsAction)

slackApp.action('add_change_default_location_action', openLocationSettingsAction)

slackApp.view('add_open_weather_token', userAddNewToken)

// start the Slack app
;(async () => {
  await slackApp.start(process.env.PORT || 4000)

  console.log('⚡️ Bolt app is running!')
})()
