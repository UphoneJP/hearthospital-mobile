import axios from "axios"
import Constants from "expo-constants"
import JWT, { SupportedAlgorithms } from "expo-jwt"
import { getToken } from "./secureStore"
import { Alert, Platform } from "react-native"
import * as Application from "expo-application"
import { router } from "expo-router"

export default async function createAxiosClient () {
  let deviceId: string
  if (Platform.OS === "android") {
    deviceId = Application.getAndroidId() || "testDeviceId"
  } else if (Platform.OS === "ios") {
    deviceId = await Application.getIosIdForVendorAsync() || "testDeviceId"
  } else {
    deviceId = "testDeviceId"
  }

  // ORIGINAL Security
  const apiKey = await getToken("apiKey")
  const JWTSecret = await getToken("JWTSecret")
  if (!apiKey || !JWTSecret) {
    Alert.alert("不正使用が確認されました。")
    router.replace('/t-home')
    return
  }
  const token = JWT.encode(
    { apiKey, timestamp: new Date().getTime() },
    JWTSecret,
    { algorithm: SupportedAlgorithms.HS256 }
  )

  return axios.create({
    baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
    headers: {
      "api-key-needed": `Bearer ${token}`,
      "deviceid": deviceId,
      "Content-Type": "application/json"
    }
  })
}

