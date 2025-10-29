import { StyleSheet, Text, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'

interface PropsType {
  title: string
  icon: "visibility" | "visibility-off"
  children: React.ReactNode
}

export default function MyPageBox({title, icon, children}:PropsType){
  return (
    <>
      <View style={{flexDirection: 'row'}}>
        <MaterialIcons 
          name={icon}
          size={24} 
          color="black" 
        />
        <Text>{title}</Text>
      </View>

      <View style={styles.visibleBox}>
        {children}
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  visibleBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#666666',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16
  }
})
