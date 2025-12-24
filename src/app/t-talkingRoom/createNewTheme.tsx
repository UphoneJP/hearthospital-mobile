import CustomButton from "@/src/components/parts/CustomButton"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Alert, StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native-paper"

export default function CreateNewTheme() {
  const [title, setTitle] = useState<string>("")
  const [detail, setDetail] = useState<string>("")
  const { user } = useContext(AuthContext)
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)


  async function sendNewTalkTheme(){
    const titleNoSpace = title.trim()
    const detailNoSpace = detail.trim()
    if(!titleNoSpace || !detailNoSpace){
      Alert.alert('タイトルと説明の両方を記述してください')
      return
    }
    try {
      setServerLoading(true)
      setLoadingPercentage(0)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post('/api/talkingRoom/new', {
        title: titleNoSpace, 
        detail: detailNoSpace, 
        userId: user?._id
      })
      setTitle("")
      setDetail("")
      Alert.alert('トークテーマを作成しました')
      setServerLoading(false)
      router.replace({
        pathname: '/t-talkingRoom',
        params: { refresh: 'true' }
      })
    } catch(err) {
      console.error(err)
      setServerLoading(false)
      Alert.alert('エラーでトークテーマを作成できませんでした')
    }
  }


  return (
    <BackgroundTemplate>

      <Text style={styles.headerTitle}>新しいトークテーマを作る</Text>

      <View style={styles.container}>
        <TextInput
          label="タイトル"
          mode="outlined"
          onChangeText={text => setTitle(text)}
          value={title}
          autoFocus
          outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
          contentStyle={{color: 'orange'}}
          theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
        />

        <TextInput
          label="説明"
          mode="outlined"
          onChangeText={text => setDetail(text)}
          value={detail}
          style={{height: 120}}
          multiline
          outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
          contentStyle={{color: 'orange'}}
          theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
        />

        <CustomButton
          title="作成"
          color='orange'
          fun={sendNewTalkTheme}
          style={{paddingVertical: 4}}
        />
      </View>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    marginTop: 32,
    marginBottom: 8
  },
  container: {
    width: '80%',
    margin: 'auto',
    marginVertical: 16,
    padding: 16,
    gap: 8
  },
  mask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40
  }
})
