import createAxiosClient from '@/utils/axiosClient'
import { TextInput } from 'react-native-paper'
import { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native'

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
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post('/api/user/checkEmail', {email})
      setAnswer(response?.data.nums)
      setExpire(response?.data.expire10min)
      setSent(true)
    } catch {
      Alert.alert('エラー', 'メールの送信に失敗しました')
      setSending(false)
    }
  }

  return (
    <>
      <TextInput
        label={email.length > 0 ? 'Emailアドレス' : 'Emailアドレスを入力'}
        mode="outlined"
        value={email}
        onChangeText={(text:string)=>setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        outlineStyle={{borderColor: sending? 'gray' : 'orange', backgroundColor: 'white'}}
        contentStyle={{color: sending? 'gray' : 'orange'}}
        theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
        style={{marginVertical: 16}}
        right={email.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
        disabled={sending}
      />


      {sent?(
        <Text style={styles.mailSent}>認証メールを送信しました。</Text>
      ):(
        <>
          {sending? (
            <ActivityIndicator color="white" style={styles.mailSendButton}/>
          ) : (
            <>
              {/* ＠を入力したら送信ボタン出現 */}
              {email.includes('@')&&
                <TouchableOpacity onPress={sendEmailFun}>
                  <Text style={styles.mailSendButton}>
                    上記Eメールアドレスへ認証メールを送信
                  </Text>
                </TouchableOpacity>
              }
            </>
          )}
        </>
      )}

      {sent &&
        <TextInput 
          label='メールに記載された認証番号'
          mode="outlined"
          style={{marginBottom: 16}}
          value={authNum}
          onChangeText={(text)=>setAuthNum(text)}
          autoCapitalize="none"
          contentStyle={{color: 'orange'}}
          outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
          theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
          right={authNum.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
        />
      }
    </>
  )
}
const styles = StyleSheet.create({
  mailSendButton: {
    color: 'white',
    backgroundColor: 'orange',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    textAlign: 'center',
    borderRadius: 8,
    marginBottom: 16
  },
  mailSent: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8
  },
  authNumInput: {
    borderWidth: 4,
    flex: 1,
    padding: 0,
    borderRadius: 32,
    borderColor: 'orange',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
    height: 48
  }
  
})
