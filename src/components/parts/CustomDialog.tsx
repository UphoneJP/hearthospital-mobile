import { router } from "expo-router"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

interface PropsType {
  dialogVisible: boolean
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
  setAddButtonVisible?: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CustomDialog(props: PropsType) {
  const { dialogVisible, setDialogVisible, setAddButtonVisible } = props
  function hideDialog() {
    setDialogVisible(false)
    if(setAddButtonVisible){setAddButtonVisible(true)}
  }

  return (
    dialogVisible && (
      <View style={styles.mask} onTouchEnd={hideDialog}>
        <View style={styles.container}>
          <MaterialIcons 
            name="clear" 
            size={24} 
            color="#333333"
            style={styles.clear} 
            onPress={hideDialog}  
          />
          <Text style={{ fontSize: 16 }}>投稿にはログインが必要です</Text>
          <View style={styles.actions}>

            <TouchableOpacity 
              onPress={() => {
                hideDialog()
                router.push('/user/register')
              }}
            >
              <Text style={styles.way}>
                新規アカウント登録
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                hideDialog()
                router.push('/user/login')
              }}
            >
              <Text style={styles.way}>
                ログイン
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  )
}
const styles = StyleSheet.create({
  mask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 40,
    borderColor: 'orange',
    borderWidth: 1
  },
  clear: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 50,
    padding: 8
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16
  },
  way: { 
    color: "blue", 
    fontSize: 16,
    textDecorationLine: 'underline',
    padding: 12
  }
})
