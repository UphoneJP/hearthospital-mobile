import axios from "axios"
import Constants from "expo-constants"
import JWT, { SupportedAlgorithms } from "expo-jwt"
import { getToken } from "./secureStore"
import { Alert } from "react-native"
import * as Application from "expo-application"
import { router } from "expo-router"
import CryptoJS from 'crypto-js'

export default async function createAxiosClient () {
  const deviceId = Application.getAndroidId() || 'testDeviceId'
  let nonce = 'thisIsTestNonce'
  let timestamp = 1800000000000
  let cryptoToken = "thisIsTestCryptoToken"
  let signature = "thisIsTestSignature"

  async function generateAndSave(){
    // nonce, timestamp, cryptoTokenを生成
    const baseUrl = Constants.expoConfig?.extra?.API_BASE_URL
    const nonceObject = (await axios.get(`${baseUrl}/getRandomBytes`)).data.nonceObject
    nonce = nonceObject.nonce
    timestamp = nonceObject.iat

    cryptoToken = (await axios.post(`${baseUrl}/getCrypto`, {
      deviceId,
      nonce,
      timestamp
    })).data.cryptoToken

    // signature(署名)の生成
    const payload = `${nonce}:${timestamp}:${cryptoToken}`
    signature = CryptoJS.HmacSHA256(
      CryptoJS.enc.Utf8.parse(payload),
      CryptoJS.enc.Utf8.parse(deviceId)
    ).toString(CryptoJS.enc.Hex)
  }

  try {
    await generateAndSave()
  } catch {
    Alert.alert('エラーでサーバーアクセスが拒否されました。')
    router.replace('/t-home')
    return
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
      "nonce": nonce,
      "timestamp": timestamp,
      "deviceid": deviceId,
      "cryptotoken": cryptoToken,
      "signature": signature,
      "Content-Type": "application/json"
    }
  })
}

