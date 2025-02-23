import axios from "axios"
import Constants from "expo-constants"

const axiosClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
  headers: {
    "api-key-ini": Constants.expoConfig?.extra?.API_KEY_INI
  }
})

export default axiosClient
