import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'

import { TabProvider } from '../context/tabContext'
import { AuthProvider } from "../context/loginContext"
import { MessageProvider } from "../context/messageContext"
import { MenuProvider } from "../context/menuContext"

export default function Layout() {

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
