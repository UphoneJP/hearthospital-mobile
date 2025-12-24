import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { TextInput } from "react-native-paper"
import { useContext, useEffect, useState } from "react"
import { LoadingContext } from "@/src/context/loadingContext"
import createAxiosClient from "@/utils/axiosClient"
import { talkThemeType } from "@/src/types/types"

interface PropsType {
  selectedTalkTheme: talkThemeType | null
  editDialogVisible: boolean
  setEditDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
  setNum: React.Dispatch<React.SetStateAction<number>>
}
export default function CustomDialog2(props: PropsType) {
  const { selectedTalkTheme, editDialogVisible, setEditDialogVisible, setNum } = props
  const [title, setTitle] = useState<string>('')
  const [detail, setDetail] = useState<string>('')
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)
  function hideDialog() {
    setEditDialogVisible(false)
  }
  async function editFun(){
    try {
      if(!title.trim() || !detail.trim()){
        Alert.alert('タイトルと説明の両方を記述してください')
        return
      }
      setServerLoading(true)
      setLoadingPercentage(0)
      const axiosClient = await createAxiosClient()
      await axiosClient?.patch(`/api/talkingRoom/${selectedTalkTheme?._id}`, {
        title: title,
        detail: detail
      })
      setNum((prev)=>prev + 1)
      setEditDialogVisible(false)
      Alert.alert('編集が完了しました')
    } catch {
      setServerLoading(false)
      Alert.alert('エラーで編集できませんでした')
    }
  }

  useEffect(() => {
    if (selectedTalkTheme) {
      setTitle(selectedTalkTheme.title || '')
      setDetail(selectedTalkTheme.detail || '')
    }
  }, [selectedTalkTheme, editDialogVisible])

  if(!editDialogVisible)return null

  return (
    <View style={styles.mask}>
      <View style={styles.container}>
        <TouchableOpacity
            style={styles.clear}
            onPress={hideDialog}  
          >
            <MaterialIcons 
              name="clear" 
              size={24} 
              color="#333333"
            />
          </TouchableOpacity>
        <Text style={styles.dialogTitle}>
          トークテーマを編集
        </Text>
        <View style={styles.actions}>
          <Text style={styles.subtitle}>
            タイトル
          </Text>
          <TextInput
            mode="outlined"
            onChangeText={text => setTitle(text)}
            value={title}
            autoFocus
            outlineStyle={styles.outline}
            contentStyle={{color: 'orange'}}
            theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
          />
          <Text style={styles.subtitle}>
            説明
          </Text>
          <TextInput
            mode="outlined"
            onChangeText={text => setDetail(text)}
            value={detail}
            style={{height: 120}}
            multiline
            outlineStyle={styles.outline}
            contentStyle={{color: 'orange'}}
            theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
          />
          <TouchableOpacity 
            onPress={() => {
              editFun()
              hideDialog()
            }}
            style={styles.button}
          >
            <Text style={styles.way}>
              変更する
            </Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
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
  actions: {
    // justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16
  },
  subtitle: {
    color: 'orange',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 4
  },
  button: {
    width: '40%',
    marginTop: 16,
    marginHorizontal: 'auto',
    backgroundColor: "orange",
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
  },
  outline: {
    borderColor: 'orange', 
    backgroundColor: 'white'
  }
})
