import { AppHomeOpenedEvent, Middleware, SlackEventMiddlewareArgs } from '@slack/bolt'
import { userOptionDatabase } from '../database/database'
import { appHome, appHomeNoToken } from '../views/apphome'

const userHomeOpened: Middleware<SlackEventMiddlewareArgs> = async ({ event, client, logger }) => {
  const userConfigExists = await userOptionDatabase.exists((<AppHomeOpenedEvent>event).user)
  try {
    if (userConfigExists) {
      const res = await client.views.publish({
        user_id: (<AppHomeOpenedEvent>event).user,
        view: appHomeNoToken(),
      })

      logger.info(res)
    } else {
      const res = await client.views.publish({
        user_id: (<AppHomeOpenedEvent>event).user,
        view: appHome({}, {}),
      })

      logger.info(res)
    }
  } catch (e) {
    logger.error(e)
  }
}

export { userHomeOpened }
