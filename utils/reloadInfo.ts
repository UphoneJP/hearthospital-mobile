import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { Alert } from "react-native"
import { saveData } from './asyncStorage'

export default async function reloadInfo() {
  try {
    const axiosClient = await createAxiosClient()
    const response = await axiosClient?.get("/api/allInfo")
    if(!response) return

    const { hospitals, reviews, talkThemes} = response.data
    await saveData('hospitals', JSON.stringify(hospitals))
    await saveData('reviews', JSON.stringify(reviews))
    await saveData('talkThemes', JSON.stringify(talkThemes))
    Alert.alert("情報を最新に更新しました。")
  } catch {
    router.replace('/t-home')
    Alert.alert("情報の更新に失敗しました。再度お試しください。")
  }
}

