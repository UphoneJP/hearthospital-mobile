import { useEffect } from "react"
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import * as NavigationBar from "expo-navigation-bar"

import { TabProvider } from '../context/tabContext'
import { AuthProvider } from "../context/loginContext"
import { MessageProvider } from "../context/messageContext"
import { MenuProvider } from "../context/menuContext"

export default function Layout() {

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden")
    NavigationBar.setBehaviorAsync("overlay-swipe")
  }, [])

  return (
    <TabProvider>
      <AuthProvider>
        <MenuProvider>
          <MessageProvider>
            <Stack 
              screenOptions={{
                headerShown: false
              }}
            />
            <StatusBar backgroundColor="orange" barStyle="light-content" />
          </MessageProvider>
        </MenuProvider>
      </AuthProvider>
    </TabProvider>
  )
}
