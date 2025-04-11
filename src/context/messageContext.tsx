import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import Constants from "expo-constants"
import { AuthContext } from "./loginContext"
import { type messageType } from "../types/types"
import { Alert } from "react-native"

const socket = io(Constants.expoConfig?.extra?.API_BASE_URL)

interface MessageContextType {
  unReadMessages: messageType[]
  markAsReadIO: (personId: string, userId: string, messageId: string)=> void
  messages: messageType[]
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>
  sendForm: (
    userId: string,
    personId: string,
    messageInput: string,
    setMessageInput: React.Dispatch<React.SetStateAction<string>>,
    setSending: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>
}
const defaultMessageContext = {
  unReadMessages: [],
  markAsReadIO: () => {},
  messages: [],
  setMessages: () => {},
  sendForm: async () => {}
}
const UnReadMessagesContext = createContext<MessageContextType>(defaultMessageContext)

const MessageProvider = ({children}:{children: React.ReactNode}) => {
  const { user } = useContext(AuthContext)
  const [unReadMessages, setUnReadMessages] = useState<messageType[]>([])
  const [messages, setMessages] = useState<messageType[]>([])

  // ■EMIT
  function markAsReadIO( // ④自分が既読した
    userId: string,
    personId: string, 
    messageId: string
  ) { 
    socket.emit("markAsRead", {userId, personId, messageId}) 
  }
  
  async function sendForm(  // ⑦自分がメッセージを送信した
    userId: string,
    personId: string,
    content: string,
    setMessageInput: React.Dispatch<React.SetStateAction<string>>,
    setSending: React.Dispatch<React.SetStateAction<boolean>>
  ){
    setSending(true)
    try {
      socket.emit("sendMessage", {userId, personId, content}, (response: { status: number })=>{
        if (response.status === 200) {
          console.log("メッセージを送信しました")
        } else {
          Alert.alert('エラーでメッセージを送信できませんでした')
        }
      })
    } catch {
      Alert.alert('エラーでメッセージを送信できませんでした')
    }
    setSending(false)
    setMessageInput('')
  }
    

  useEffect(()=>{
    if (!user) {
      setUnReadMessages([])
      return
    }

    // ■EMIT
    // ①初回登録・通信開始
    socket.emit("register", user._id)
    console.log("socket connected")
    // ②未読数取得request
    socket.emit("requestUnReadMessages", user._id)

    // ■ON
    // ③未読数取得return
    socket.on("returnUnReadArray", (unReadArray: messageType[]) => {
      setUnReadMessages(unReadArray)
    })
    // ⑤自分の未読数を更新
    socket.on("messageReadToMe", (updatedUnReadArray: messageType[]) => {
      setUnReadMessages(updatedUnReadArray)
    })
    // ⑥相手に既読を通知
    socket.on("messageReadToFriend", (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, shown: true } : message
        )
      )
    })
    // ⑧送信したら自分も更新
    socket.on("sentMessage", (newMessage: messageType) => {
      console.log("newMessage", newMessage)
      setMessages((prev) => [...prev, newMessage])
    })
    // ⑨newMessageを受信側へ通知
    socket.on("recieveMessage", (newMessage: messageType, unReadArray: messageType[]) => {
      setUnReadMessages(unReadArray)
      setMessages((prev) => [...prev, newMessage])
    })

    return () => {
      socket.off("returnUnReadArray")
      socket.off("messageReadToMe")
      socket.off("messageReadToFriend")
      socket.off("sentMessage")
      socket.off('recieveMessage')
    }
  }, [user])  

  return (
    <UnReadMessagesContext.Provider value={{
      unReadMessages, 
      markAsReadIO,
      sendForm,
      messages, 
      setMessages
    }}>
      {children}
    </UnReadMessagesContext.Provider>
  )
}

export { MessageProvider, UnReadMessagesContext }
