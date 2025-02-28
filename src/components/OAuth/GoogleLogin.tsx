/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect } from 'react'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'
import { AuthContext } from '@/src/context/loginContext'

WebBrowser.maybeCompleteAuthSession()

export default function App() {
  const { googleLogin } = useContext(AuthContext)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID_ANDROID,
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID_IOS,
    webClientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID_WEB,
    scopes: ["profile", "email"]
  })

  useEffect(()=>{
    if (response?.type === "success"){
      googleLogin(response)
    }
  }, [response])

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Light}
      onPress={()=>promptAsync()}
    />
  )
}

