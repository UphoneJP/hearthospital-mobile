// import { AuthContext } from '@/src/context/loginContext'
// import * as AppleAuthentication from 'expo-apple-authentication'
// import { useContext } from 'react'
// import { StyleSheet, Alert } from 'react-native'

export default function App() {
  // const { appleLogin } = useContext(AuthContext)
  return (
    <></>
    // <AppleAuthentication.AppleAuthenticationButton
    //   buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
    //   buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
    //   cornerRadius={5}
    //   style={styles.button}
    //   onPress={async () => {
    //     try {
    //       const credential = await AppleAuthentication.signInAsync({
    //         requestedScopes: [
    //           AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    //           AppleAuthentication.AppleAuthenticationScope.EMAIL
    //         ]
    //       })
    //       appleLogin(credential)

    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     } catch (e:any) {
    //       if (e.code === 'ERR_REQUEST_CANCELED') {
    //         Alert.alert('ログインが正しく実施されませんでした。もう一度ログインしてください')
    //       } else {
    //         Alert.alert('apple loginでエラーが発生しました')
    //       }
    //     }
    //   }}
    // />
  )
}

// const styles = StyleSheet.create({
//   button: {
//     width: '90%',
//     marginHorizontal: 'auto',
//     height: 44
//   }
// })
