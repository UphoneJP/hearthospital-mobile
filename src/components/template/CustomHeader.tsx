import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CustomHeader = () => {
  const insets = useSafeAreaInsets()
  return <View style={[styles.container, { paddingTop: insets.top }]} />
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    height: 60
  }
})

export default CustomHeader
