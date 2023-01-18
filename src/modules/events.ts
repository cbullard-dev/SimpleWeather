//@ts-nocheck
import { SlackActionMiddlewareArgs } from '@slack/bolt'
import { Middleware } from '@slack/bolt/dist/types'
import { add_weather_token, settings } from '../views/modals'

const openSettingsAction: Middleware<SlackActionMiddlewareArgs> = async ({
  ack,
  client,
  body,
  logger,
  action,
}) => {
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

export = { openSettingsAction }
