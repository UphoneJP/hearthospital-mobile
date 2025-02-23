import RaisedButton from "@/src/components/parts/RaisedButton"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import EmailInputForm from "@/src/components/user/EmailInputForm"
import axiosClient from "@/utils/axiosClient"
import { Card, Input } from "@rneui/themed"
import { router } from "expo-router"
import { useState } from "react"
import { Alert, StyleSheet } from "react-native"

export default function resetPW(){
  const [email, setEmail] = useState<string>('')
  const [authNum, setAuthNum] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [expire, setExpire] = useState<number>(0)
  const [password, setPassword] = useState<string>('')

  async function resetPWFun(email: string, password: string){
    await axiosClient.post('/api/user/resetPassword', {email, password})
    router.replace('/user/login')
    Alert.alert('パスワードを再設定しました')
  }

  return (
    <BackgroundTemplate>
      <Card containerStyle={styles.card}>

        <Card.Title style={{fontSize: 16}}>
          ログインパスワード再設定
        </Card.Title>

        <Card.Divider />

        <EmailInputForm
          email={email}
          setEmail={setEmail}
          authNum={authNum}
          setAuthNum={setAuthNum}
          setAnswer={setAnswer}
          setExpire={setExpire}
        />

        <Input 
          placeholder="新しいパスワード" 
          value={password}
          onChangeText={(text)=>setPassword(text)}
          autoCapitalize="none"
          secureTextEntry={true}
          textContentType="password"
        />
      
        <RaisedButton 
          title='パスワード再設定' 
          color='orange'
          fun={()=>resetPWFun(email, password)}
          styleChange={styles.button}
          disabled={email&&authNum===answer&&Date.now() < expire&&password?false:true}
        />
      </Card>
    </BackgroundTemplate>
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
