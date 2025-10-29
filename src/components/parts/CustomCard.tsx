import { StyleSheet, View } from "react-native"

interface PropsType {
  children: React.ReactNode;
  style?: object;
}
export default function CustomCard(props: PropsType) { 
  const { children, style } = props
  return (
    <View 
      style={[styles.card, style]}
    >
      <View style={{flex: 1}}>
        {children}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }
})
