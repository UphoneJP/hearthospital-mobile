import { Picker } from '@react-native-picker/picker'
import { StyleSheet } from 'react-native'

// const screenWidth = Dimensions.get("window").width - 32

interface PropsType {
  selectedValue: string
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>
}

export default function Selector ({selectedValue, setSelectedValue}:PropsType) {
  
  return (
    <Picker
      selectedValue={selectedValue}
      style={styles.picker}
      onValueChange={(itemValue) => setSelectedValue(itemValue)}
    >
      <Picker.Item label="令和３年度データ" value="R3" />
      <Picker.Item label="令和４年度データ" value="R4" />
      <Picker.Item label="令和５年度データ" value="R5" />
      <Picker.Item label="令和６年度データ" value="R6" />
    </Picker>
  )
}
const styles = StyleSheet.create({
  picker: {
    height: 60, 
    width: 220, 
    backgroundColor: '#fede9d',
    marginBottom: 16,
    marginHorizontal: 'auto'
  }
})
