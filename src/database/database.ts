import { UserOptions, WeatherData } from '../utils/types'
import { Installation } from '@slack/bolt'

const oauthDatabaseData: Record<string, Installation> = {}
const oauthDatabase = {
  set: async (key: string, data: Installation) => {
    oauthDatabaseData[key] = data
    console.log('Added Database Element: ', oauthDatabaseData)
  },
  get: async (key: string) => {
    console.log('Return Database Element: ', oauthDatabaseData)
    return oauthDatabaseData[key]
  },
  exists: async (key: string) => {
    console.log('Checking is team token exists')
    return Object.prototype.hasOwnProperty.call(oauthDatabaseData, key)
  },
  delete: async (key: string) => {
    delete oauthDatabaseData[key]
  },
}

const userTokenDatabaseData: Record<string, string> = {}
const userTokenDatabase = {
  set: async (key: string, userToken: string) => {
    userTokenDatabaseData[key] = userToken
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

const userOptionDatabaseData: Record<string, UserOptions> = {}
const userOptionDatabase = {
  set: async (key: string, userOptionData: UserOptions) => {
    userOptionDatabaseData[key] = userOptionData
    console.log(userOptionDatabaseData)
  },
  get: async (key: string) => {
    console.log(userOptionDatabaseData[key])
    return userOptionDatabaseData[key]
  },
  exists: async (key: string) => {
    console.log('Checking key value pair exists', Object.prototype.hasOwnProperty.call(userOptionDatabaseData, key))
    return Object.prototype.hasOwnProperty.call(userOptionDatabaseData, key)
  },
  delete: async (key: string) => {
    console.log('Deleting data ', userOptionDatabaseData[key])
    delete userOptionDatabaseData[key]
  },
  updateTokenActivate: async (key: string, tokenActivation: boolean) => {
    console.log('update user record ', tokenActivation)
    userOptionDatabaseData[key].tokenActive = tokenActivation
  },
}

const weatherDatabaseData: Record<string, WeatherData> = {}
const weatherDatabase = {
  set: async (key: string, weatherData: WeatherData) => {
    weatherDatabaseData[key] = weatherData
    console.log(weatherDatabaseData)
  },
  get: async (key: string) => {
    console.log(weatherDatabaseData[key])
    return weatherDatabaseData[key]
  },
  exists: async (key: string) => {
    console.log('Checking key value pair exists', Object.prototype.hasOwnProperty.call(weatherDatabaseData, key))
    return Object.prototype.hasOwnProperty.call(weatherDatabaseData, key)
  },
  delete: async (key: string) => {
    console.log('Deleting data ', weatherDatabaseData[key])
    delete weatherDatabaseData[key]
  },
}

// type UserConfig = {
//   defaultLocation: string
// }

export { userTokenDatabase, oauthDatabase, userOptionDatabase, weatherDatabase }
