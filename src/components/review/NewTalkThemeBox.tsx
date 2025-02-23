import { AuthContext } from "@/src/context/loginContext"
import axiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Alert } from "react-native"
import { Button, Dialog, Portal, TextInput } from "react-native-paper"

interface PropsType {
  dialogVisible: boolean
  setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
  setNum: React.Dispatch<React.SetStateAction<number>>
}

export default function NewTalkThemeBox ( prop: PropsType) {
  const { dialogVisible, setDialogVisible, setNum } = prop
  const { user } = useContext(AuthContext)
  const [newTalkTheme, setNewTalkTheme] = useState<string>("")
  const [detail, setDetail] = useState<string>("")

  function hideDialog () { setDialogVisible(false) }
  async function sendNewTalkTheme(){
    const title = newTalkTheme.trim()
    const detailNoSpace = detail.trim()
    if(!title || !detailNoSpace){
      Alert.alert('タイトルと説明の両方を記述してください')
      return
    }
    try {
      await axiosClient.post('/api/talkingRoom/new', {title, detailNoSpace, user})
      hideDialog()
      setNewTalkTheme('')
      setDetail('')
      setNum((prev)=>prev + 1)
    } catch {
      Alert.alert('エラーでトークテーマを作成できませんでした')
    }
  }

  return (
    <Portal>
      <Dialog 
        visible={dialogVisible} 
        onDismiss={hideDialog}
        style={{backgroundColor: 'white'}}
      >
        {user? (
          <>
            <Dialog.Title style={{color: 'orange', textAlign: 'center', fontSize: 20}}>
              新しいトークテーマ
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="タイトル"
                mode="outlined"
                value={newTalkTheme}
                onChangeText={text => setNewTalkTheme(text)}
                autoFocus
                outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                contentStyle={{color: 'orange'}}
                theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
              />
              <TextInput
                label="説明"
                mode="outlined"
                value={detail}
                onChangeText={text => setDetail(text)}
                style={{height: 120}}
                multiline
                outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                contentStyle={{color: 'orange'}}
                theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
                textColor="orange" 
                onPress={sendNewTalkTheme}
              >
                作成
              </Button>
            </Dialog.Actions>
          </>
        ): (
          <>
            <Dialog.Title>ログインが必要です</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={hideDialog}>キャンセル</Button>
              <Button onPress={()=>router.push('/user/login')}>ログイン</Button>
              <Button onPress={()=>router.push('/user/register')}>新規アカウント登録</Button>
            </Dialog.Actions>
          </>
        )}
        
      </Dialog>
    </Portal>
  )
}
