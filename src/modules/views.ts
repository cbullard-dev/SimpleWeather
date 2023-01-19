import { Middleware, SlackViewMiddlewareArgs } from '@slack/bolt'
import { userTokenDatabase, userOptionDatabase } from '../database/database'
import { settingsModal } from '../views/modals'

const userAddNewToken: Middleware<SlackViewMiddlewareArgs> = async ({ ack, view, body, logger }) => {
  try {
    // console.log(body)

    // Get the token value from the the user input
    const apiTokenTextValue = view.state.values['open_weather_input']['api_token_text_input'].value

    // If the apiTokenTextValue is not a string return
    if (typeof apiTokenTextValue !== 'string') return

    // Add the new Open Weather API token to the database
    await userTokenDatabase.set(body.user.id, apiTokenTextValue)

    // Update the TokenActive status on the userOptionDatabase
    await userOptionDatabase.updateTokenActivate(body.user.id, await userTokenDatabase.exists(body.user.id))

    // Update the userSettingsModal with the new userOptionDatabase
    await ack({ response_action: 'update', view: settingsModal(await userOptionDatabase.get(body.user.id)) })

    // Log userTokenDatabase entry
    logger.info('Adding API token result: ', await userTokenDatabase.get(body.user.id))
  } catch (e) {
    // Log out the error
    logger.error(e)
  }
}

export { userAddNewToken }
