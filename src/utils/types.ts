type UserOptions = {
  unitOfMeasurement: MeasurementUnits
  tokenActive: boolean
  defaultLocation?: WeatherLocation
  defaultLocationSet: boolean
}

enum MeasurementUnits {
  'metric',
  'imperial',
}

type WeatherLocation = {
  name: string
  state?: string
  countryCode: string
  longitude: number
  latitude: number
}

type WeatherData = {
  coord: {
    lon: number
    lat: number
  }
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    }
  ]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  rain: {
    '1h': number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

const UserOptionsDefault: UserOptions = {
  unitOfMeasurement: MeasurementUnits.metric,
  defaultLocationSet: false,
  tokenActive: false,
}

export { UserOptions, MeasurementUnits, WeatherData, UserOptionsDefault }
