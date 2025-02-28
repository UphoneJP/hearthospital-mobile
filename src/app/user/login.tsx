import { useContext, useEffect } from "react"
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import GoogleLogin from "@/src/components/OAuth/GoogleLogin"
import LoginBox from "@/src/components/user/LoginBox"
import { AuthContext } from "@/src/context/loginContext"
import AppleLogin from "@/src/components/OAuth/AppleLogin"

export default function Login () {
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(()=>{
    if(isLoggedIn) router.replace('/user/myPage')
  }, [])

  return (
    <BackgroundTemplate>
      {/* ローカルログイン */}
      <LoginBox />

      {/* デバイダー */}
      <View style={styles.divider} />

      {/* Googleログイン */}
      <GoogleLogin />

      {/* appleログイン */}
      {Platform.OS === 'ios' && (
        <>
          <View style={{padding:8}}/>
          <AppleLogin />
        </>
      )}
      
      {/* デバイダー */}
      <View style={styles.divider} />

      {/* リンク */}
      <TouchableOpacity onPress={()=>router.replace('user/register')}>
        <Text style={styles.link}>新規ユーザー登録はこちら</Text>
      </TouchableOpacity>
      
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  divider: {
    width: 300,
    borderWidth: 2,
    borderColor: '#bbbbbb',
    marginVertical: 24,
    margin: 'auto'
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
    marginVertical: 16
  }
})
