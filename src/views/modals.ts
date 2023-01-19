import { Modal, Blocks, Elements, Option } from 'slack-block-builder'
import { UserOptions, MeasurementUnits } from '../utils/types'

export const settingsModal = (userOptions: UserOptions) => {
  const metricOption = Option().text('Metric').value('metric_units').description('Use °C')
  const imperialOption = Option().text('Imperial').value('imperial_value').description('Use °F')

  const tokenActive = userOptions.tokenActive
  let unitOfMeasurement = metricOption
  let default_location = 'Not set'
  let location_button_text = 'Set default location'

  if (userOptions.unitOfMeasurement.valueOf() === MeasurementUnits.imperial) {
    unitOfMeasurement = imperialOption
  }

  if (userOptions && userOptions.defaultLocation && userOptions.defaultLocationSet) {
    default_location = `${userOptions.defaultLocation.name}, ${userOptions.defaultLocation.countryCode}`
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
        Elements.RadioButtons().options(metricOption, imperialOption).initialOption(unitOfMeasurement).actionId('unit_of_measurement_toggle')
      ),
      Blocks.Divider(),
      // Location settings block
      Blocks.Header().text('Default Location Settings'),
      Blocks.Section().text('Settings for your default location'),
      Blocks.Section().text(`*Default Location*: ${default_location}`),
      Blocks.Actions().elements(Elements.Button().text(`${location_button_text}`).actionId('add_change_default_location_action')),
      Blocks.Divider(),
      Blocks.Header().text('Token Settings'),
      Blocks.Section().text("Head over to Open Weather Map <https://openweathermap.org/|here> if you don't have a token yet!"),
      Blocks.Section().text(`*Token active:* ${tokenActive}`),
      Blocks.Actions().elements(Elements.Button().text('Add Open Weather API token').actionId('add_open_weather_api_token'))
    )
    .submit('Save Settings')
    .clearOnClose()
    .buildToObject()
}

export const addWeatherTokenModal = () => {
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
            .maxLength(70)
            .focusOnLoad(true)
            .placeholder('API token here')
            .actionId('api_token_text_input')
            .dispatchActionOnEnterPressed()
        )
    )
    .submit('Save')
    .close('back')
    .notifyOnClose()
    .buildToObject()
}

export const weatherLocationSearchModal = () => {
  return Modal()
    .title('Location search')
    .close('Close')
    .submit('Search')
    .blocks(
      Blocks.Input()
        .blockId('search_input_block')
        .element(
          Elements.TextInput()
            .actionId('search_string_text_input')
            .focusOnLoad(true)
            .placeholder('City or Location Name')
            .minLength(3)
            .dispatchActionOnEnterPressed(true)
        )
        .label('Location search:')
    )
    .buildToObject()
}
