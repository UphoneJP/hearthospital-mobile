import RaisedButton from "@/src/components/parts/RaisedButton"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import BannerAds from "@/src/components/template/BannerAds"
import EmailInputForm from "@/src/components/user/EmailInputForm"
import createAxiosClient from "@/utils/axiosClient"
import { Card, Input } from "@rneui/themed"
import { router } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native"

export default function resetPW(){
  const [email, setEmail] = useState<string>('')
  const [authNum, setAuthNum] = useState<string>('')
  const [answer, setAnswer] = useState<string>('')
  const [expire, setExpire] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  async function resetPWFun(email: string, password: string){
    try {
      setLoading(true)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post('/api/user/resetPassword', {email, password})
      router.replace('/user/login')
      Alert.alert('パスワードを再設定しました')
    } catch {
      Alert.alert('エラーが発生しました')
    }
    setLoading(false)
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
          title={loading? 
            <ActivityIndicator size="small" color="orange" /> : 'パスワード再設定' 
          } 
          color='orange'
          fun={()=>resetPWFun(email, password)}
          styleChange={styles.button}
          disabled={email&&authNum===answer&&Date.now() < expire&&password&&!loading?false:true}
        />
      </Card>

      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>
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
