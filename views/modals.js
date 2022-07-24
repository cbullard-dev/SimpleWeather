const { Modal, Blocks, Elements, Bits } = require('slack-block-builder')

const settings = () => {
  return Modal()
    .title('User Settings')
    .callbackId('submit_user_settings')
    .blocks(
      Blocks.Header().text('Settings'),
      Blocks.Section().text('Open Weather Map API Token'),
      Blocks.Actions().elements(
        Elements.Button()
          .text('Add new Open Weather Maps API token')
          .actionId('add_api_token')
      ),
      Blocks.Header().text('Weather Settings'),
      Blocks.Section().text('Unit of Measurement'),
      Blocks.Actions().elements(
        Elements.RadioButtons()
          .options('Metric', 'Imperial')
          .initialOption('Metric')
          .actionId()
      )
    ).buildToObject
}

const add_weather_token = () => {
  return Modal().buildToObject()
}

module.exports = {
  settings,
  add_weather_token,
}
