import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface PropsType {
  diseases: string[],
  setInputVal?: React.Dispatch<React.SetStateAction<string>>
  func?: (disease: string) => void
}

export default function DiseasesBox({diseases, setInputVal, func}:PropsType) {
  return (
    <>
      <Text style={{textAlign:'center'}}>口コミ病名検索候補一覧</Text>
      <View style={styles.diseaseBox}>
        {diseases.map(disease=> {
          return (
            <TouchableOpacity
              key={disease}
              style={styles.diseaseButton}
              onPress={()=>{
                if(setInputVal) setInputVal(disease)
                if(func) func(disease)
              }}
            >
              <Text selectable={true} style={styles.disease}>
                {disease}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  diseaseBox: {
    width: '98%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 1,
    padding: 4,
    marginHorizontal: 'auto',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#555555'
  },
  diseaseButton: {
    backgroundColor: '#eeeeee',
    display: 'flex'
  },
  disease: {
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 2,
    backgroundColor: '#eeeeee',
    color: '#333333',
    fontSize: 10
  }
})
