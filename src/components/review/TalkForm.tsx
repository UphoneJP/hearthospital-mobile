import { useContext, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import axiosClient from "@/utils/axiosClient"
import { talkThemeType } from "@/src/types/types"
import { AuthContext } from "@/src/context/loginContext"

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

  function sendForm () {
    if(!reviewText.trim()) return
    
    setSending(true)
    axiosClient.post(`/api/talkingRoom/${talkTheme?._id}`, { reviewText, user })
    .then((response)=>{
      setNum(prev => prev + 1)
      Alert.alert('口コミ投稿しました')
      setReviewText('')
      setSending(false)
      setInputVisible(false)
      setAddButtonVisible(true)
      setUser(response.data.DBuser)
    })
    .catch((e)=>{
      Alert.alert('エラーが発生しました。')
      console.log(e)
      setSending(false)
    })
  }

  return (
    <View style={styles.inputBox}>
      <TextInput 
        autoFocus
        multiline={true}
        autoCapitalize='none'
        value={reviewText}
        placeholder="口コミ入力"
        onChangeText={(text)=>setReviewText(text)}
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
