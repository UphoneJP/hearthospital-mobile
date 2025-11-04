import CustomInput from "@/src/components/parts/CustomInput"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { AuthContext } from "@/src/context/loginContext"
import { useContext, useEffect, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useTab } from "@/src/context/tabContext"
import { getToken, deleteToken } from "@/utils/secureStore"
import { LoadingContext } from "@/src/context/loadingContext"
import CustomCard from "@/src/components/parts/CustomCard"
import CustomButton from "@/src/components/parts/CustomButton"


export default function Form(){
  const { user } = useContext(AuthContext)
  const [formContent, setFormContent] = useState<string>('')
  const { onTabPress } = useTab()
  const { setServerLoading } = useContext(LoadingContext)

  useEffect(()=>{
    (async () => {
      const leftForm = await getToken('form')
      setFormContent(leftForm || '')
    })()
  }, [])

  async function sendFun(){
    try {
      setServerLoading(true)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post('/api/others/form', {
        formContent,
        authorId: user?._id
      })
      Alert.alert('問い合わせを送信いたしました。ご返答をお待ちください。')
      deleteToken('form')
      onTabPress('home')
      setServerLoading(false)
      router.replace('/t-home')
    } catch {
      Alert.alert('エラーで送信できませんでした')
      setServerLoading(false) 
    }
  }

  return (
    <BackgroundTemplate>
      <Text style={styles.title}>お問い合わせ</Text>
      {user?(
        <ScrollView style={{width: '100%'}}>
          <Text style={styles.username}>
            {user.penName||user.username}さん: ログイン中
          </Text>
          <CustomCard>
            <Text>
              アプリの未熟なところや運営において様々なお気づきの点が多数あるかと思います。一つ一つ改善していきますので、多くのご意見をお待ちしています。数日以内にアプリ内のダイレクトメッセージにて返答いたします。
            </Text>
            <CustomInput 
              label="お問い合わせ内容"
              val={formContent}
              setVal={setFormContent}
              style={{height:400}}
              multiline={true}
              sessionName="form"
            />
          </CustomCard>
          <CustomButton
            title="送信"
            color={formContent?"orange":"#dddddd"}
            disabledFun={formContent?false:true}
            fun={sendFun}
          />
        </ScrollView>
      ):(
        <>
          <Text style={{marginBottom: 16}}>
            お問い合わせには
            <TouchableOpacity onPress={()=>{
              onTabPress('login')
              router.push('/user/login')
            }}>
              <Text style={styles.link}>ログイン</Text>
            </TouchableOpacity>
            が必要です。
          </Text>
          <Text style={{marginHorizontal: 32, textAlign: 'center'}}>
            また、ログイン不要の
            <TouchableOpacity onPress={()=>{
              onTabPress('feedback')
              router.push('/others/feedback')
            }}>
              <Text style={styles.link}>フィードバック</Text>
            </TouchableOpacity>
            にて、お気付きの点をお知らせください。
            （※フィードバックでは送信者を特定できないため返信はいたしません）
          </Text>
          <View style={{padding: 64}}/>
        </>
      )}
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  card: {
    width: '90%',
    marginVertical: 16,
    margin: 'auto',
    padding: 16,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 30
  },
  title: {
    marginVertical: 32,
    fontSize: 24
  },
  username: {
    textAlign: 'center',
    color: 'gray'
  },
  tips: {
    padding: 8
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  button: {
    marginVertical: 32,
    marginHorizontal: 64
  }
})
