import { AuthContext } from "@/src/context/loginContext"
import { useContext, useEffect } from "react"
import { router } from "expo-router"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import RegisterBox from "@/src/components/user/RegisterBox"
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import GoogleLogin from "@/src/components/OAuth/GoogleLogin"
import BannerAds from "@/src/components/template/BannerAds"
import AppleLogin from "@/src/components/OAuth/AppleLogin"

export default function Register () {
  const { isLoggedIn } = useContext(AuthContext)


  useEffect(()=>{
    if(isLoggedIn) router.replace('/user/myPage')
  }, [])

  return (
    <BackgroundTemplate>
      {/* ローカル登録 */}
      <RegisterBox />

      {/* デバイダー */}
      <View style={styles.divider} />

      {/* Googleログイン */}
      <GoogleLogin />

      {/* appleログイン */}
      {Platform.OS === 'ios' && <AppleLogin />}

      {/* デバイダー */}
      <View style={styles.divider} />

      {/* リンク */}
      <TouchableOpacity onPress={()=>router.replace('user/login')}>
        <Text style={styles.link}>ログインはこちら</Text>
      </TouchableOpacity>

      <View style={{padding: 32}}/>

      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>

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
    marginVertical: 4
  }
})
