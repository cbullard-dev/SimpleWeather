// @ts-nocheck
import { Modal, Blocks, Elements, Option, Bits } from 'slack-block-builder'

export const settings = (options) => {
  const metric_option = Option().text('Metric').value('metric_units').description('Use °C')
  const imperial_option = Option().text('Imperial').value('imperial_value').description('Use °F')

  let unit_of_measurement = metric_option
  let token_active = false
  let default_location = 'Not set'
  let location_button_text = 'Set default location'

  if (options && options.unit_of_measurement && options.unit_of_measurement !== 'metric') {
    unit_of_measurement = imperial_option
  }

  if (options && options.token_active && options.token_active === true) {
    token_active = true
  }

  if (options && options.default_location && options.default_location !== 'Not set') {
    default_location = options.default_location
    location_button_text = 'Change default location'
  }

  // Return the settings modal for use in Slack
  return Modal()
    .title('User Settings')
    .callbackId('submit_user_settings')
    .blocks(
      // Weather settings block
      Blocks.Header().text('Weather Settings'),
      Blocks.Section().text('Select unit of measurement'),
      Blocks.Actions().elements(
        Elements.RadioButtons()
          .options(metric_option, imperial_option)
          .initialOption(unit_of_measurement)
          .actionId('unit_of_measurement_toggle')
      ),
      Blocks.Divider(),
      // Location settings block
      Blocks.Header().text('Default Location Settings'),
      Blocks.Section().text('Settings for your default location'),
      Blocks.Section().text(`*Default Location*: ${default_location}`),
      Blocks.Actions().elements(
        Elements.Button()
          .text(`${location_button_text}`)
          .actionId('add_change_default_location_action')
      ),
      Blocks.Divider(),
      Blocks.Header().text('Token Settings'),
      Blocks.Section().text(
        "Head over to Open Weather Map <https://openweathermap.org/|here> if you don't have a token yet!"
      ),
      Blocks.Section().text(`*Token active:* ${token_active}`),
      Blocks.Actions().elements(
        Elements.Button().text('Add new Open Weather Maps API token').actionId('add_api_token')
      )
    )
    .submit('Save Settings')
    .buildToObject()
}

export const add_weather_token = () => {
  // Return the add token modal for use in Slack
  return Modal()
    .title('Add Open Weather Token')
    .callbackId('add_open_weather_token')
    .blocks(
      Blocks.Header().text('Open Weather Map Token'),
      Blocks.Divider(),
      Blocks.Input()
        .blockId('open_weather_input')
        .optional()
        .label('Enter Open Weather Token')
        .element(
          Elements.TextInput()
            .minLength(10)
            .maxLength(255)
            .focusOnLoad(true)
            .placeholder('API token here')
            .actionId('api_token_text_input')
        )
    )
    .submit('Save')
    .close('back')
    .notifyOnClose()
    .buildToObject()
}
