import { Middleware, SlackViewMiddlewareArgs } from '@slack/bolt'
import { userTokenDatabase, userOptionDatabase } from '../database/database'
import { settingsModal } from '../views/modals'

const userAddNewToken: Middleware<SlackViewMiddlewareArgs> = async ({ ack, view, body, logger }) => {
  try {
    console.log(body)
    const apiTokenTextValue = view.state.values['open_weather_input']['api_token_text_input'].value
    if (typeof apiTokenTextValue !== 'string') return
    await userTokenDatabase.set(body.user.id, apiTokenTextValue)
    await userOptionDatabase.updateTokenActivate(body.user.id, await userTokenDatabase.exists(body.user.id))
    await ack({ response_action: 'update', view: settingsModal(await userOptionDatabase.get(body.user.id)) })

    logger.info('Adding API token result: ', await userTokenDatabase.get(body.user.id))
  } catch (e) {
    logger.error(e)
  }
}

export { userAddNewToken }
