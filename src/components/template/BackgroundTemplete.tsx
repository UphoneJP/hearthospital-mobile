/* eslint-disable @typescript-eslint/no-require-imports */
import { View, StyleSheet, ImageBackground } from 'react-native'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useContext } from 'react'

import DraggableMenuButton from "./DraggableMenuButton"
import Menu from './Menu'
import Tabs from './Tabs'
import { MenuContext } from '@/src/context/menuContext'

const BackgroundTemplate = ({ children }: { children: React.ReactNode }) => {
  const { menuVisible, toggleMenu } = useContext(MenuContext)

  return (
    <GestureHandlerRootView>

      <ImageBackground
        source={require('@/assets/smartphone2.jpg')}
        style={styles.background}
      >
        <View style={styles.overlay}>
          {children}
          { menuVisible && <Menu /> }
        </View>
      </ImageBackground>

      <DraggableMenuButton onPress={toggleMenu} />
      <Tabs />
    </GestureHandlerRootView>
  )
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(253, 235, 207, 0.80)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default BackgroundTemplate
