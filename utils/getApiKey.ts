import { Alert, Platform } from "react-native"
import { saveToken } from "./secureStore"
import * as Application from "expo-application"
import Constants from "expo-constants"
import axios from "axios"
import {jwtDecode} from "jwt-decode"
import CryptoJS from 'crypto-js'

const axiosClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL
})

interface DecodedToken {
  apiKey: string
  JWTSecret: string
  deviceId: string
  iat: number
}

export default async function getApiKey() {
  try {
    
    // ①デバイスIDの取得
    let deviceId: string
    if (Platform.OS === "android") {
      deviceId = Application.getAndroidId() || "testDeviceId"
    } else if (Platform.OS === "ios") {
      deviceId = await Application.getIosIdForVendorAsync() || "testDeviceId"
    } else {
      deviceId = "testDeviceId"
    }

    // ②timestampの作成
    const timestamp = Date.now()

    // ③HMAC署名の生成
    const payload = `${deviceId}:${timestamp}`
    const apiKeyIni = Constants.expoConfig?.extra?.API_KEY_INI
    const signature = CryptoJS.HmacSHA256(
      CryptoJS.enc.Utf8.parse(payload),
      CryptoJS.enc.Utf8.parse(apiKeyIni)
    ).toString(CryptoJS.enc.Hex)

    // サーバーへ①②③と共にリクエスト
    const response = await axiosClient.post("/firstLaunch", {
      deviceId,
      timestamp,
      signature
    })

    // 返ってきたトークンをデコードして検証
    const token = response.data.token
    const decoded = jwtDecode<DecodedToken>(token)
    if (
      !decoded ||
      !decoded.iat ||
      decoded.iat + 300 < Math.floor(Date.now() / 1000) ||
      deviceId !== decoded.deviceId
    ) {
      Alert.alert('データベースとの通信初期設定に失敗しました。')
      return
    }

    // 検証が問題無ければapiKeyとJWTSecretを保存
    await saveToken('apiKey', decoded.apiKey)
    await saveToken('JWTSecret', decoded.JWTSecret)
    await saveToken('lastContactTime', Date.now().toString())

  } catch (err) {
    console.log('初期通信エラー:', err)
    Alert.alert('エラーが発生しました。データベースへアクセスできません。')
  }
}

