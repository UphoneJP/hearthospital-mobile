/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'

WebBrowser.maybeCompleteAuthSession()

export default function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID,
    androidClientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID_ANDROID,
    iosClientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID_IOS,
    webClientId: Constants.expoConfig?.extra?.GOOGLE_OAUTH_CLIANT_ID_WEB,
    scopes: ["profile", "email"]
  })

  useEffect(()=>{
    if (response?.type === "success"){
      console.log(response)
    }
  }, [response])

  return (
    <View style={styles.container}>
      <Button 
        title={loggedIn? "Get UserInfo": "LogIn"}
        onPress={()=>promptAsync()}  
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
