import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import createAxiosClient from "@/utils/axiosClient"
import { talkThemeType } from "@/src/types/types"
import { AuthContext } from "@/src/context/loginContext"
import { saveToken, getToken, deleteToken } from "@/utils/secureStore"

interface PropsType {
  talkTheme: talkThemeType | undefined
  setNum: React.Dispatch<React.SetStateAction<number>>
  setInputVisible: React.Dispatch<React.SetStateAction<boolean>>
  setAddButtonVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TalkForm (prop:PropsType) {
  const { talkTheme, setNum, setInputVisible, setAddButtonVisible } = prop
  const [reviewText, setReviewText] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)
  const { user, setUser } = useContext(AuthContext)

  
  useEffect(()=>{
    if(!talkTheme) return
    (async()=>{
      const leftReview = await getToken(talkTheme._id)
      setReviewText(leftReview || '')
    })()
  },[])

  async function sendForm () {
    if(!reviewText.trim()) return
    if(!talkTheme) return
    setSending(true)
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post(`/api/talkingRoom/${talkTheme?._id}`, { reviewText, user })
      setNum(prev => prev + 1)
      Alert.alert('口コミ投稿しました')
      setReviewText('')
      deleteToken(talkTheme._id)
      setSending(false)
      setInputVisible(false)
      setAddButtonVisible(true)
      setUser(response?.data.DBuser)
    } catch {
      Alert.alert('エラーが発生しました。')
      setSending(false)
    }
  }

  return (
    <View style={styles.inputBox}>
      <TextInput 
        autoFocus
        multiline={true}
        autoCapitalize='none'
        value={reviewText}
        placeholder="口コミ入力"
        onChangeText={async(text)=>{
          setReviewText(text)
          if(!talkTheme) return
          await saveToken(talkTheme._id, text)
        }}
        style={styles.textInput}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={sendForm}  
      >
        {sending?(
          <ActivityIndicator color='white'/>
        ):(
          <Text style={{color: 'white'}}>送信</Text>
        )}
        
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8
  },
  sendButton: {
    paddingHorizontal: 8,
    marginHorizontal: 4,
    backgroundColor: 'blue',
    borderRadius: 8,
    justifyContent: 'center'
  }
})
