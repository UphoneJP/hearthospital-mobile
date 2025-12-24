import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useContext } from "react"
import { LoadingContext } from "@/src/context/loadingContext"
import createAxiosClient from "@/utils/axiosClient"
import { AuthContext } from "@/src/context/loginContext"
import { talkThemeType } from "@/src/types/types"

interface PropsType {
  talkTheme: talkThemeType | null
  deleteDialogVisible: boolean
  setDeleteDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
  setNum: React.Dispatch<React.SetStateAction<number>>
}
export default function CustomDialog3(props: PropsType) {
  const { user } = useContext(AuthContext)
  const { talkTheme, deleteDialogVisible, setDeleteDialogVisible, setNum } = props
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)
  function hideDialog() {
    setDeleteDialogVisible(false)
  }
  async function deleteFun() {
      try {
        setServerLoading(true)
        setLoadingPercentage(0)
        const axiosClient = await createAxiosClient()
        await axiosClient?.post(`/api/talkingRoom/${talkTheme?._id}`, {user})
        setNum((prev: number)=>prev + 1)
        Alert.alert('トークテーマを削除しました')
        setDeleteDialogVisible(false)
      } catch {
        setServerLoading(false)
        Alert.alert('エラー', '削除できませんでした')
      }
    }

  return (
    deleteDialogVisible && (
      <View style={styles.mask} onTouchEnd={hideDialog}>
        <View style={styles.container}>
          <MaterialIcons 
            name="clear" 
            size={24} 
            color="#333333"
            style={styles.clear} 
            onPress={hideDialog}  
          />
          <Text style={styles.dialogTitle}>
            トークテーマを削除
          </Text>
          <Text style={styles.subtitle}>
            トークテーマ内の全ての投稿が削除されます。よろしいですか？
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity 
              onPress={() => {
                deleteFun()
                hideDialog()
              }}
              style={[styles.button, {backgroundColor: 'red'}]}
            >
              <Text style={styles.way}>
                削除する
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => {
                hideDialog()
              }}
              style={[styles.button, {backgroundColor: 'gray'}]}
            >
              <Text style={styles.way}>
                キャンセル
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
    paddingHorizontal: 16,
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
  subtitle: {
    color: 'orange',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16
  },
  button: {
    width: '40%',
    marginTop: 16,
    marginHorizontal: 'auto',
    borderRadius: 16, 
    fontSize: 16,
    paddingVertical: 8
  },
  way: { 
    textAlign: 'center',
    color: "white"
  },
  dialogTitle: {
    color: 'orange',
    fontSize: 20,
    textAlign: 'center'
  }
})
