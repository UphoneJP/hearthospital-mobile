import { Card, Input } from '@rneui/themed'
import { useContext, useState } from 'react'
import RaisedButton from '../parts/RaisedButton'
import { AuthContext } from '@/src/context/loginContext'
import { ActivityIndicator, StyleSheet } from 'react-native'
import EmailInputForm from './EmailInputForm'

export default function RegisterBox(){
  const [penName, setPenName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [authNum, setAuthNum] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [expire, setExpire] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { register } = useContext(AuthContext)

  return(
    <Card containerStyle={styles.card}>

      <Card.Title style={{fontSize: 16}}>
        新規HeartHospitalアカウント登録
      </Card.Title>
      
      <Card.Divider />

      <Input
        placeholder='ペンネーム'
        value={penName}
        onChangeText={(text:string)=>setPenName(text)}
        autoCapitalize="none"
      />
      
      <EmailInputForm
        email={email}
        setEmail={setEmail}
        authNum={authNum}
        setAuthNum={setAuthNum}
        setAnswer={setAnswer}
        setExpire={setExpire}
      />
      
      <Input 
        placeholder="パスワード" 
        value={password}
        onChangeText={(text)=>setPassword(text)}
        autoCapitalize="none"
        secureTextEntry={true}
        textContentType="password"
      />

      <RaisedButton 
        title={loading? <ActivityIndicator size='small' color='orange'/> : '新規ユーザー登録' }
        color='orange'
        fun={()=>{
          if(!penName || !email || !password) return
          setLoading(true)
          register(penName, email, password, setLoading)
        }}
        styleChange={styles.button}
        disabled={
          penName
          &&email
          &&authNum===answer
          &&Date.now() < expire
          &&password
          &&!loading
          ? false : true }
      />

    </Card>
  )
}
const styles = StyleSheet.create({
  card: {
    width: '90%',
    padding: 24,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 30
  },
  button: {
    marginHorizontal: 40
  }  
})
