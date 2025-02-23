/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useRef } from "react"
import { Animated, TouchableOpacity, StyleSheet, Text } from "react-native"
import { PanGestureHandler, State } from "react-native-gesture-handler"
import { MaterialIcons } from "@expo/vector-icons"
import { Badge } from 'react-native-paper'
import { UnReadMessagesContext } from "@/src/context/messageContext"

export default function DraggableMenuButton({ onPress }: { onPress: () => void }) {
  const { unReadMessages } = useContext(UnReadMessagesContext)

  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const lastOffset = useRef({ x: 0, y: 0 }).current
  
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false }
  )
  
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      lastOffset.x += event.nativeEvent.translationX
      lastOffset.y += event.nativeEvent.translationY
      translateX.setOffset(lastOffset.x)
      translateY.setOffset(lastOffset.y)
      translateX.setValue(0) // リセット
      translateY.setValue(0) // リセット
    }
  }
  
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ translateX }, { translateY }] }
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <MaterialIcons name="menu" size={32} color="white" />
          <Text style={styles.string}>menu</Text>
          {unReadMessages.length > 0 &&
            <Badge style={styles.badge}>{unReadMessages.length}</Badge>
          }
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: 64,
    right: 24
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  string: {
    color: 'white',
    marginTop: -8
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5
  }
})
