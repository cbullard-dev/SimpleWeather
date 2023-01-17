// @ts-nocheck

const databaseData = {}
const database = {
  set: async (key: string, data: Installation<AuthVersion, boolean>) => {
    databaseData[key] = data
    console.log('Added Database Element: ', databaseData)
  },
  get: async (key: string) => {
    console.log('Return Database Element: ', databaseData)
    return databaseData[key]
  },
  exists: async (key: string) => {
    console.log('Checking is team token exists')
    return Object.prototype.hasOwnProperty.call(databaseData, key)
  },
  delete: async (key: string) => {
    delete databaseData[key]
  },
}

const userTokenDatabaseData = {}
const userTokenDatabase = {
  set: async (userId: string, userToken: string) => {
    userTokenDatabaseData[userId] = userToken
    console.log(userTokenDatabaseData)
  },
  get: async (userId: string) => {
    console.log(userTokenDatabaseData[userId])
    return userTokenDatabaseData[userId]
  },
  exists: async (userId: string) => {
    console.log('Checking if user token exists')
    return Object.prototype.hasOwnProperty.call(userTokenDatabaseData, userId)
  },
  delete: async (userId: string) => {
    console.log('Deleting data ', userTokenDatabaseData[userId])
    delete userTokenDatabaseData[userId]
  },
}

const userConfigDatabaseData = {}
const userConfigDatabase = {
  set: async (key: string, userConfigData: UserConfig) => {
    userConfigDatabaseData[key] = userConfigData
    console.log(userConfigDatabaseData)
  },
  get: async (key: string) => {
    console.log(userConfigDatabaseData[key])
    return userConfigDatabaseData[key]
  },
  exists: async (key: string) => {
    console.log(
      'Checking key value pair exists',
      Object.prototype.hasOwnProperty.call(userConfigDatabaseData, key)
    )
    return Object.prototype.hasOwnProperty.call(userConfigDatabaseData, key)
  },
  delete: async (key: string) => {
    console.log('Deleting data ', userConfigDatabaseData[key])
    delete userConfigDatabaseData[key]
  },
}

const weatherDatabaseData = {}
const weatherDatabase = {
  set: async (key: string, weatherData) => {
    weatherDatabaseData[key] = weatherData
    console.log(weatherDatabaseData)
  },
  get: async (key: string) => {
    console.log(weatherDatabaseData[key])
    return weatherDatabaseData[key]
  },
  exists: async (key: string) => {
    console.log(
      'Checking key value pair exists',
      Object.prototype.hasOwnProperty.call(weatherDatabaseData, key)
    )
    return Object.prototype.hasOwnProperty.call(weatherDatabaseData, key)
  },
  delete: async (key: string) => {
    console.log('Deleting data ', weatherDatabaseData[key])
    delete weatherDatabaseData[key]
  },
}

type UserConfig = {
  defaultLocation: string
}

export = { userTokenDatabase, database, userConfigDatabase, weatherDatabase }
