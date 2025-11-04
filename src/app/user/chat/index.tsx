import { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { router } from "expo-router"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { AuthContext } from "@/src/context/loginContext"
import { type usersExceptContactPersonsType, type contactPersonType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import SearchFriend from "@/src/components/chatRoom/SearchFriend"
import FriendsList from "@/src/components/chatRoom/FriendsList"
import { UnReadMessagesContext } from "@/src/context/messageContext"
import BannerAds from "@/src/components/template/BannerAds"
import { LoadingContext } from "@/src/context/loadingContext"

export default function Chat() {
  const { user } = useContext(AuthContext)
  const { setMessages } = useContext(UnReadMessagesContext)
  const [contactPersons, setContactPersons] = useState<contactPersonType[]|undefined>(undefined)
  const [usersExceptContactPersons, setUsersExceptContactPersons] = useState<usersExceptContactPersonsType[]>([])
  const { serverLoading, setServerLoading } = useContext(LoadingContext)

  function handlePress(personId: string){
    router.push(`/user/chat/${user?._id}/${personId}`)
  }

  useEffect(()=>{
    setServerLoading(true)
    setMessages([])
    async function fetchData(){
      if(!user)return
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.post('/api/others/chatBox', {user})
        setContactPersons(response?.data.contactPersons)
        setUsersExceptContactPersons(response?.data.usersExceptContactPersons)
      } catch {
        Alert.alert('エラーが発生し、メッセージデータを取得できませんでした')
      }
    }
    fetchData()
  }, [])

  useEffect(()=>{
    if(contactPersons)setServerLoading(false)
  }, [contactPersons])

  if(!user) return (
    <BackgroundTemplate>
      <Text>ログインしてから操作してください</Text>
    </BackgroundTemplate>
  )

  return(
    <BackgroundTemplate>

      {!serverLoading&&(
        <>
          <Text style={styles.title}>メッセージBOX</Text>
          <ScrollView style={{width: '100%', padding: 32}}>

            <SearchFriend
              usersExceptContactPersons={usersExceptContactPersons}
              handlePress={handlePress}
              />
            
            <View style={{padding:16}} />

            <FriendsList 
              contactPersons={contactPersons}
              handlePress={handlePress}
              />

            <View style={{padding: 64}} />
          
          </ScrollView>
        </>
      )}

      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  title: {
    marginVertical: 32,
    fontSize: 24
  }
})
