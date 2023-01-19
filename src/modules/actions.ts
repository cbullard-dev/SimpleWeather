import { SlackActionMiddlewareArgs, Middleware, BlockAction } from '@slack/bolt'
import { settingsModal, addWeatherTokenModal, weatherLocationSearchModal } from '../views/modals'
import { userOptionDatabase } from '../database/database'
import { UserOptionsDefault } from '../utils/types'

const openSettingsAction: Middleware<SlackActionMiddlewareArgs> = async ({ ack, client, body, logger }) => {
  logger.info('Triggered: openSettingsAction')
  console.log(body)
  await ack()
  if (!(await userOptionDatabase.exists(body.user.id))) {
    await userOptionDatabase.set(body.user.id, UserOptionsDefault)
  }
  try {
    const modalOpen = await client.views.open({
      trigger_id: (<BlockAction>body).trigger_id,
      view: settingsModal(await userOptionDatabase.get(body.user.id)),
    })
    logger.info(modalOpen)
  } catch (e) {
    logger.error(e)
  }
}

const openLocationSettingsAction: Middleware<SlackActionMiddlewareArgs> = async ({ ack, client, body }) => {
  await ack()
  client.views.push({
    trigger_id: (<BlockAction>body).trigger_id,
    view: weatherLocationSearchModal(),
  })
}

const openWeatherTokenSettingsAction: Middleware<SlackActionMiddlewareArgs> = async ({ ack, client, body }) => {
  await ack()
  client.views.push({
    trigger_id: (<BlockAction>body).trigger_id,
    view: addWeatherTokenModal(),
  })
}

export { openSettingsAction, openLocationSettingsAction, openWeatherTokenSettingsAction }
