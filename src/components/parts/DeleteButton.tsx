import createAxiosClient from "@/utils/axiosClient"
import { Alert, StyleSheet, Text } from "react-native"
import { Button, Dialog, Portal } from "react-native-paper"
import { useContext, useState } from "react"
import { AuthContext } from "@/src/context/loginContext"
import { talkThemeType } from "@/src/types/types"

interface propsType {
  talkTheme: talkThemeType
  setNum: React.Dispatch<React.SetStateAction<number>>
}
export default function DeleteButton ({talkTheme, setNum}: propsType) {
  const { user } = useContext(AuthContext)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false)
  const [talkThemeState, setTalkThemeState] = useState<talkThemeType | null>(null)

  async function deleteFun() {
    try {
      setDeleteDialogVisible(false)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post(`/api/talkingRoom/${talkThemeState?._id}`, {user})
      setNum((prev: number)=>prev + 1)
      Alert.alert('トークテーマを削除しました')
    } catch {
      Alert.alert('エラー', '削除できませんでした')
    }
  }

  return (
    <>
      <Text
        style={styles.deleteButton}
        onPress={()=>{
          setTalkThemeState(talkTheme)
          setDeleteDialogVisible(true)
        }}
      >
        削除
      </Text>

      {/* 削除画面 */}
      <Portal>
        <Dialog 
          visible={deleteDialogVisible} 
          onDismiss={()=>setDeleteDialogVisible(false)}
          style={{backgroundColor: 'white'}}
        >
          <Dialog.Title style={styles.dialogTitle}>
            トークテーマを削除
          </Dialog.Title>
          <Dialog.Content>
            <Text>
              トークテーマ内の全ての投稿が削除されます。よろしいですか？
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              textColor="orange" 
              onPress={()=>setDeleteDialogVisible(false)}
            >
              キャンセル
            </Button>
            <Button 
              textColor="red" 
              onPress={deleteFun}
            >
              削除する
            </Button>
          </Dialog.Actions>          
        </Dialog>
      </Portal>
    </>
  )
}
const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
    width: 48,
    paddingBottom: 4,
    paddingTop: 2,
    borderRadius: 4
  },
  dialogTitle: {
    color: 'orange', 
    textAlign: 'center', 
    fontSize: 20
  }
})
