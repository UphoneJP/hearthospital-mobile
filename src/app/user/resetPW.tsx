import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import BannerAds from "@/src/components/template/BannerAds"
import EmailInputForm from "@/src/components/user/EmailInputForm"
import createAxiosClient from "@/utils/axiosClient"
import { Button, Divider, TextInput } from "react-native-paper"
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Alert, StyleSheet, Text, View } from "react-native"
import CustomCard from "@/src/components/parts/CustomCard"
import { LoadingContext } from "@/src/context/loadingContext"

export default function resetPW(){
  const [email, setEmail] = useState<string>('')
  // const [authNum, setAuthNum] = useState<string>('')
  // const [answer, setAnswer] = useState<string>('')
  // const [expire, setExpire] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const { setServerLoading } = useContext(LoadingContext)
  const readyForSent = email && password ? true : false
  // const readyForSent = email && password && authNum.length === 6 && authNum === answer && Date.now() < expire ? true : false

  async function resetPWFun(){
    try {
      setServerLoading(true)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post('/api/user/resetPassword', {email, password})
      router.replace('/user/login')
      // setAuthNum('')
      // setAnswer('')
      Alert.alert('パスワードを再設定しました')
    } catch {
      Alert.alert('エラーが発生しました')
    }
    setServerLoading(false)
  }

  return (
    <BackgroundTemplate>
      <CustomCard>

        <Text style={styles.title}>
          ログインパスワード再設定
        </Text>

        <Divider />

        <EmailInputForm
          email={email}
          setEmail={setEmail}
          // authNum={authNum}
          // setAuthNum={setAuthNum}
          // setAnswer={setAnswer}
          // setExpire={setExpire}
        />

        <TextInput
          label={password.length > 0 ? '新しいパスワード' : '新しいパスワードを入力'}
          mode="outlined"
          value={password}
          onChangeText={(text:string)=>setPassword(text)}
          autoCapitalize="none"
          textContentType="password"
          outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
          contentStyle={{color: 'orange'}}
          theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
          style={{marginVertical: 16}}
          secureTextEntry={true}
          right={password.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
        />

      </CustomCard>
      <Button
        style={{
          borderWidth: 0,
          marginHorizontal: 40, 
          marginTop: 16
        }}
        mode="outlined"
        labelStyle={{ color: 'white' }}
        onPress={resetPWFun}
        disabled={!readyForSent}
        contentStyle={{backgroundColor: readyForSent ? 'orange' : '#dddddd'}}
      >
        パスワード再設定
      </Button>

      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16
  },
  button: {
    marginHorizontal: 40
  }  
})
