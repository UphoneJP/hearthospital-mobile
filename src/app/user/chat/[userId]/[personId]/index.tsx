import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import createAxiosClient from "@/utils/axiosClient"
import MessageHeader from "@/src/components/chatRoom/MessageHeader"
import MessageForm from "@/src/components/chatRoom/MessageForm"
import Messsages from "@/src/components/chatRoom/Messages"
import { UnReadMessagesContext } from "@/src/context/messageContext"
import { Alert, Text } from "react-native"

export default function ChatRoom(){
  const userId = useSearchParams().get('userId')
  const personId = useSearchParams().get('personId')
  const [recieverName, setRecieverName] = useState<string>('')
  const { setMessages } = useContext(UnReadMessagesContext)

  async function getMessages(){
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.get(`/api/others/chat/${userId}/${personId}`)
      setMessages(response?.data.messages)
    } catch {
      Alert.alert('エラーが発生し。メッセージデータを取得できませんでした')
    }
  }

  async function getRecieverName(){
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.get(`/api/others/chat/recieverName/${personId}`)
      setRecieverName(response?.data.penName)
    } catch {
      Alert.alert('エラーが発生し。送信相手のデータを取得できませんでした')
    }
  }

  useEffect(()=>{
    getMessages()
    getRecieverName()
  }, [])

  if(!userId&&!personId){
    return(
      <BackgroundTemplate>
        <Text>エラーが発生しました</Text>
      </BackgroundTemplate>
    )
  }

  return (
    <BackgroundTemplate>

      <MessageHeader 
        recieverName={recieverName}
        personId={personId}
      />

      <Messsages 
        userId={userId}
        personId={personId}
      />

      <MessageForm
        userId={userId}
        personId={personId}
      />

    </BackgroundTemplate>
  )
}
