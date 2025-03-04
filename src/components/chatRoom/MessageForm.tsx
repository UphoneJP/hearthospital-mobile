import { UnReadMessagesContext } from "@/src/context/messageContext"
import { useContext, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

interface PropsType {
  userId: string | null
  personId: string | null
}
export default function MessageForm (prop:PropsType){
  const { userId, personId } = prop
  const [sending, setSending] = useState<boolean>(false)
  const [focused, setFocused] = useState<boolean>(false)
  const [messageInput, setMessageInput] = useState<string>('')
  const { sendForm } = useContext(UnReadMessagesContext)

  function handleTextChange(text: string) {
    if (text.length <= 300) {setMessageInput(text)}
  }
  function handlePress () {
    setMessageInput(messageInput.trim())
    if(userId&&personId){
      sendForm(
        userId,
        personId,
        messageInput,
        setMessageInput,
        setSending
      )
    }
  }

  return (
    <>
      {focused&&
        <Text style={styles.charCount}>
          入力上限{messageInput.length}/300
        </Text> 
      }

      <View style={styles.inputBox}>
        <TextInput 
          multiline={true}
          autoCapitalize='none'
          value={messageInput}
          placeholder="メッセージ入力"
          onChangeText={handleTextChange}
          style={styles.textInput}
          onFocus={()=>setFocused(true)}
          onBlur={()=>setFocused(false)}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handlePress}  
        >
          {sending?(
            <ActivityIndicator color='white'/>
          ):(
            <Text style={{color: 'white'}}>送信</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    padding: 8
  },
  charCount: {
    fontSize: 12,
    color: "gray",
    marginLeft: 'auto',
    paddingHorizontal: 16
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8
  },
  sendButton: {
    paddingHorizontal: 8,
    marginLeft: 4,
    backgroundColor: 'blue',
    borderRadius: 8,
    justifyContent: 'center'
  }
})

