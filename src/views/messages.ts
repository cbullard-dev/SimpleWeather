import { Message, Blocks } from 'slack-block-builder'

const welcomeMessageText = (userIdString: string) => {
  return `Hey there @<${userIdString}>\nYou will need to add a Simple Open Weather API token.\nThis can be added into the Simple Open Weather app in the Settings in [slack://AppHome|App Home]`
}

const welcomeMessageBlock = (userId: string) => {
  return Message()
    .blocks(
      Blocks.Header().text('Welcome to the Simple Open Weather app').end(),
      Blocks.Divider().end(),
      Blocks.Section().text(welcomeMessageText(userId)).end()
    )
    .buildToObject()
}

export { welcomeMessageBlock }
