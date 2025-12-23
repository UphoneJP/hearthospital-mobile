/* eslint-disable @typescript-eslint/no-require-imports */
import { View, StyleSheet, ImageBackground, ActivityIndicator, Text } from 'react-native'
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { useContext } from 'react'

import DraggableMenuButton from "./DraggableMenuButton"
import Menu from './Menu'
import Tabs from './Tabs'
import { MenuContext } from '@/src/context/menuContext'
import { LoadingContext } from '@/src/context/loadingContext'

const BackgroundTemplate = ({ children }: { children: React.ReactNode }) => {
  const { menuVisible, toggleMenu } = useContext(MenuContext)
  const { serverLoading, loadingPercentage } = useContext(LoadingContext)
  return (
    <GestureHandlerRootView>

      <ImageBackground
        source={require('@/assets/smartphone2.jpg')}
        style={styles.background}
      >
        {serverLoading && (
          <View style={styles.mask}>
            <ActivityIndicator size="large" color="orange" />
            <Text style={styles.loadingText}>
              サーバーと通信中...
            </Text>
            {loadingPercentage > 0 && 
              <Text style={styles.loadingText}>
                {loadingPercentage}%
              </Text>
            }
          </View>
        )}
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
  },
  mask: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40
  },
  loadingText: { 
    textAlign: 'center',
    fontSize: 24,
    marginTop: 8,
    color: 'orange',
    fontWeight: 'bold'
  }
})

export default BackgroundTemplate
