import { talkThemeType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native"
import { Button, Dialog, Portal, TextInput } from "react-native-paper"

interface propsType {
  talkTheme: talkThemeType
  setNum: React.Dispatch<React.SetStateAction<number>>
}

export default function EditButton(prop: propsType){
  const { talkTheme, setNum } = prop
  const [talkThemeState, setTalkThemeState] = useState<talkThemeType | null>(null)
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const idRef = useRef<string>("")
  const titleRef = useRef<string>("")
  const detailRef = useRef<string>("")
  const inputRef = useRef<React.ElementRef<typeof TextInput> | null>(null)
  const detailInputRef = useRef<React.ElementRef<typeof TextInput> | null>(null)

  // Stateが更新後に起動してeditDialogを表示
  useEffect(() => {
    if (talkThemeState) {
      idRef.current = talkThemeState._id
      titleRef.current = talkThemeState.title
      detailRef.current = talkThemeState.detail
      setEditDialogVisible(true)
      setTalkThemeState(null)
    }
  }, [talkThemeState])
    
  async function editFun(){
    setLoading(true)
    try {
      const id = idRef.current
      const title= titleRef.current.trim()
      const detail= detailRef.current.trim()
      if(!title || !detail){
        Alert.alert('タイトルと説明の両方を記述してください')
        return
      }
      const axiosClient = await createAxiosClient()
      await axiosClient?.patch(`/api/talkingRoom/${id}`, {
        title,
        detail
      })
      setNum((prev)=>prev + 1)
      setEditDialogVisible(false)
      Alert.alert('編集が完了しました')
    } catch {
      Alert.alert('エラーで編集できませんでした')
    }
    setLoading(false)
  }

  return (
    <>
      <Text
        style={[styles.deleteButton, {backgroundColor: 'blue'}]}
        onPress={()=>setTalkThemeState(talkTheme)}
      >
        編集
      </Text>

      {/* 編集画面 */}
      <Portal>
        <Dialog 
          visible={editDialogVisible} 
          onDismiss={()=>setEditDialogVisible(false)}
          style={{backgroundColor: 'white'}}
        >
          <Dialog.Title style={styles.dialogTitle}>
            トークテーマを編集
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{color: 'orange'}}>タイトル</Text>
            <TextInput
              mode="outlined"
              onChangeText={text => titleRef.current = text}
              ref={input => inputRef.current = input}
              autoFocus
              outlineStyle={styles.outline}
              contentStyle={{color: 'orange'}}
              theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
              placeholder={titleRef.current}
            />
            <Text style={{color: 'orange'}}>説明</Text>
            <TextInput
              mode="outlined"
              onChangeText={text => detailRef.current = text}
              ref={input => detailInputRef.current = input}
              style={{height: 120}}
              multiline
              outlineStyle={styles.outline}
              contentStyle={{color: 'orange'}}
              theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
              placeholder={detailRef.current}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              textColor="orange" 
              onPress={editFun}
            >
              {loading? (
                <ActivityIndicator size="small" color="orange" style={{marginRight: 8}} />
              ): (
                "変更する"
              )}
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
    fontSize: 20,
    textAlign: 'center'
  },
  outline: {
    borderColor: 'orange', 
    backgroundColor: 'white'
  }
})
