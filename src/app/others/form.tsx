import CustomInput from "@/src/components/parts/CustomInput"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { AuthContext } from "@/src/context/loginContext"
import { useContext, useEffect, useState } from "react"
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Card } from "@rneui/themed"
import { ScrollView } from "react-native-gesture-handler"
import RaisedButton from "@/src/components/parts/RaisedButton"
import axiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useTab } from "@/src/context/tabContext"
import { getToken, deleteToken } from "@/utils/secureStore"


export default function Form(){
  const { user } = useContext(AuthContext)
  const [formContent, setFormContent] = useState<string>('')
  const { onTabPress } = useTab()

  useEffect(()=>{
    (async () => {
      const leftForm = await getToken('form')
      setFormContent(leftForm || '')
    })()
  }, [])

  function sendFun(){
    axiosClient.post('/api/others/form', {
      formContent,
      author: user
    })
    Alert.alert('問い合わせを送信いたしました。ご返答をお待ちください。')
    deleteToken('form')
    onTabPress('home')
    router.replace('/t-home')
  }

  return (
    <BackgroundTemplate>
      <Text style={styles.title}>お問い合わせ</Text>
      {user?(
        <ScrollView style={{width: '100%'}}>
          <Text style={styles.username}>
            {user.penName||user.username}さん: ログイン中
          </Text>
          <Card containerStyle={styles.card}>
            <Text style={styles.tips}>
              アプリの未熟なところや運営において様々なお気づきの点が多数あるかと思います。一つ一つ改善していきますので、多くのご意見をお待ちしております。また、アプリの改良アイデアをいただけると嬉しいです。アプリ内のダイレクトメッセージにて返答いたします。数日お時間を頂きますのでご了承ください。
            </Text>
            <CustomInput 
              label="お問い合わせ内容"
              val={formContent}
              setVal={setFormContent}
              style={{height:400}}
              multiline={true}
              sessionName="form"
            />
          </Card>
          <RaisedButton
            title="送信"
            color="green"
            disabled={formContent?false:true}
            styleChange={styles.button}
            fun={sendFun}
          />
        </ScrollView>
      ):(
        <>
          <Text style={{marginBottom: 8}}>
            お問い合わせには
            <TouchableOpacity onPress={()=>{
              onTabPress('login')
              router.push('/user/login')
            }}>
              <Text style={styles.link}>ログイン</Text>
            </TouchableOpacity>
            が必要です。
          </Text>
          <Text style={{marginBottom: 8}}>
            また、返答はいたしかねますが、お気付きの点があれば
            <TouchableOpacity onPress={()=>{
              onTabPress('feedback')
              router.push('/others/feedback')
            }}>
              <Text style={styles.link}>フィードバック</Text>
            </TouchableOpacity>
            にてお知らせいただけると幸いです。
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
