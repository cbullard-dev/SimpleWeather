const weatherEmojis = (weather) => {
  const weatherEmojiString = [
    ':sunny:',
    ':mostly_sunny:',
    ':partly_sunny:',
    ':barely_sunny:',
    ':cloud:',
    ':rain_cloud:',
    ':snow_cloud:',
    ':lightning:',
    ':thunder_cloud_and_rain:',
    ':partly_sunny_rain:',
    ':fog:',
  ]
  switch (weather) {
    case 'clear sky':
      return weatherEmojiString[0]

    case 'few clouds':
      return weatherEmojiString[1]

    case 'scattered clouds':
      return weatherEmojiString[2]

    case 'broken clouds':
      return weatherEmojiString[4]

    case 'shower rain':
      return weatherEmojiString[9]

    case 'rain':
      return weatherEmojiString[5]

    case 'thunderstorm':
      return weatherEmojiString[8]

    case 'snow':
      return weatherEmojiString[6]

    case 'mist':
      return weatherEmojiString[10]

    default:
      return new Error('Error: Weather condition not found')
  }
}

module.exports = weatherEmojis
