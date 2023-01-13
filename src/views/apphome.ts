// @ts-nocheck

import { HomeTab, Blocks, Elements, Section } from 'slack-block-builder'

export const appHomeNoToken = () => {
  return HomeTab()
    .blocks(
      Blocks.Header({ text: ':mostly_sunny: Simple Weather :mostly_sunny:' }),
      Blocks.Section({
        text: 'This is a simple weather app using the Open Weather Map API',
      }),
      Blocks.Divider(),
      Blocks.Section().text(
        `Doesn't look like you have added an Open Weather Map API token yet.\nClick the settings button to setup.`
      ),
      Blocks.Actions().elements(
        Elements.Button()
          .text(':gear: Settings')
          .actionId('open_settings')
          .primary()
      )
    )
    .buildToObject()
}

export const appHome = (todays_weather, five_day_forecast) => {
  return HomeTab()
    .blocks(
      Blocks.Header({ text: ':mostly_sunny: Simple Weather :mostly_sunny:' }),
      Blocks.Section({
        text: 'This is a simple weather app using the Open Weather Map API',
      }),
      Blocks.Divider(),
      Blocks.Header({
        text: `{todays_weather.emoji} Today's Weather for ${todays_weather.data.name}`,
      }),
      Blocks.Section().fields(
        `Weather: ${todays_weather.data.weather[0].description}`,
        `Temp: ${todays_weather.data.main.temp}`,
        `Min temp: ${todays_weather.data.main.temp_min}`,
        `Max temp: ${todays_weather.data.main.temp_max}`,
        `Feels like: ${todays_weather.data.main.feels_like}`
      ),
      Blocks.Divider(),
      Blocks.Header({ text: `Settings` }),
      Blocks.Actions().elements(
        Elements.Button({
          type: 'plain_text',
          text: ':gear: Settings',
          emoji: true,
        })
          .actionId('open_settings')
          .primary()
      )
    )
    .buildToObject()
}
