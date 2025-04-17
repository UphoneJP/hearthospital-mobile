import { Stack } from 'expo-router'
import { Platform, StatusBar } from 'react-native'

import { TabProvider } from '../context/tabContext'
import { AuthProvider } from "../context/loginContext"
import { MessageProvider } from "../context/messageContext"
import { MenuProvider } from "../context/menuContext"
import CustomHeader from '../components/template/CustomHeader'

export default function Layout() {
  const deviceOS = Platform.OS

  return (
    <TabProvider>
      <AuthProvider>
        <MenuProvider>
          <MessageProvider>
            <Stack
              screenOptions={{
                headerShown: deviceOS === 'ios' ? true : false,
                header: () => <CustomHeader />
              }}
            />
            <StatusBar backgroundColor="orange" barStyle="light-content" />
          </MessageProvider>
        </MenuProvider>
      </AuthProvider>
    </TabProvider>
  )
}
