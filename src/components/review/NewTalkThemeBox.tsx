import { AuthContext } from "@/src/context/loginContext"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useContext, useRef } from "react"
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
  const titleRef = useRef<string>("")
  const detailRef = useRef<string>("")
  // クリア用
  const inputRef = useRef<React.ElementRef<typeof TextInput> | null>(null)
  const detailInputRef = useRef<React.ElementRef<typeof TextInput> | null>(null)

  function hideDialog () { setDialogVisible(false) }

  async function sendNewTalkTheme(){
    const title = titleRef.current.trim()
    const detailNoSpace = detailRef.current.trim()
    if(!title || !detailNoSpace){
      Alert.alert('タイトルと説明の両方を記述してください')
      return
    }
    try {
      const axiosClient = await createAxiosClient()
      await axiosClient?.post('/api/talkingRoom/new', {title, detailNoSpace, userId: user?._id})
      hideDialog()
      inputRef.current?.clear()
      detailInputRef.current?.clear()
      setNum((prev)=>prev + 1)
    } catch(err) {
      console.error(err)
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
                onChangeText={text => titleRef.current = text}
                ref={input => inputRef.current = input}
                autoFocus
                outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                contentStyle={{color: 'orange'}}
                theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
              />
              <TextInput
                label="説明"
                mode="outlined"
                onChangeText={text => detailRef.current = text}
                ref={input => detailInputRef.current = input}
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
