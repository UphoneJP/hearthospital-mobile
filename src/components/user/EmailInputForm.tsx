import axiosClient from '@/utils/axiosClient'
import { Input } from '@rneui/themed'
import { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface PropsType {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  authNum: string
  setAuthNum: React.Dispatch<React.SetStateAction<string>>
  setAnswer: React.Dispatch<React.SetStateAction<string>>
  setExpire: React.Dispatch<React.SetStateAction<number>>
}
export default function EmailInputForm (prop: PropsType) {
  const { email, setEmail, authNum, setAuthNum, setAnswer, setExpire } = prop

  const [sending, setSending] = useState<boolean>(false)
  const [sent, setSent] = useState<boolean>(false)

  async function sendEmailFun() {
    setSending(true)
    const response = await axiosClient.post('/api/user/checkEmail', {email})
    setAnswer(response.data.nums)
    setExpire(response.data.expire10min)
    setSent(true)
  }

  return (
    <>
      <Input
        placeholder='Emailアドレス'
        value={email}
        onChangeText={(text)=>setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        style={{flex: 1}}
        disabled={sending}
      />

      <View style={styles.authNumBox}>
        {/* 左側 */}
        {sent?(
          <Text style={styles.mailSent}>送信しました</Text>
        ):(
          <>
            {sending? (
              <ActivityIndicator color="white" style={styles.mailSendButton}/>
            ) : (
              <>
                {/* ＠を入力したら送信ボタン出現 */}
                {email.includes('@')&&
                  <TouchableOpacity 
                    disabled={!email.includes('@')} 
                    onPress={sendEmailFun}
                  >
                    <Text style={styles.mailSendButton}>
                      上記Eメールアドレスへ認証メールを送信
                    </Text>
                  </TouchableOpacity>
                }
              </>
            )}
          </>
        )}

        {/* 右側 */}
        {sent &&
          <TextInput 
            placeholder='メールに記載された認証番号'
            style={styles.authNumInput}
            value={authNum}
            onChangeText={(text)=>setAuthNum(text)}
          />
        }
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  authNumBox: {
    marginBottom: 32, 
    flexDirection: 'row', 
    justifyContent: 'center'
  },
  mailSendButton: {
    color: 'white',
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'orange'
  },
  mailSent: {
    color: 'orange',
    backgroundColor: 'white',
    paddingVertical: 8,
    width: 120,
    textAlign: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderColor: 'orange',
    borderWidth: 1
  },
  authNumInput: {
    borderWidth: 4,
    flex: 1,
    padding: 0,
    height: 38,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: 'orange',
    textAlign: 'center'
  }
  
})
