import { useContext } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { AuthContext } from '@/src/context/loginContext'
import * as AppleAuthentication from 'expo-apple-authentication'

export default function AppleLogin() {
  const { appleLogin } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL
              ]
            })
            appleLogin(credential)
          } catch {
            Alert.alert(`ログインができませんでした` )
          }
        }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: 300,
    height: 44
  }
})
