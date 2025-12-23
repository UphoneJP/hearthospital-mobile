import CustomInput from "@/src/components/parts/CustomInput"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { useContext, useEffect, useState } from "react"
import { Alert, StyleSheet, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useTab } from "@/src/context/tabContext"
import { getToken, deleteToken } from "@/utils/secureStore"
import CustomCard from "@/src/components/parts/CustomCard"
import CustomButton from "@/src/components/parts/CustomButton"
import { LoadingContext } from "@/src/context/loadingContext"

export default function Feedback(){
  const [feedbackContent, setFeedbackContent] = useState<string>('')
  const { onTabPress } = useTab()
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)

  useEffect(()=>{
    (async () => {
      const leftFeedback = await getToken('feedback')
      setFeedbackContent(leftFeedback || '')
    })()
  }, [])

  async function sendFun(){
    try {
      setServerLoading(true)
      setLoadingPercentage(0)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post('/api/others/feedback', {feedbackContent})
      Alert.alert('フィードバックを送信いたしました。ご意見、ありがとうございます。')
      deleteToken('feedback')
      onTabPress('home')
      router.replace('/t-home')
      setServerLoading(false)
    } catch {
      Alert.alert('エラーで送信できませんでした')
      setServerLoading(false)
    }
  }

  return (
    <BackgroundTemplate>
      <Text style={styles.title}>フィードバック</Text>
      <ScrollView style={{width: '100%'}}>
        <CustomCard>
          <Text style={styles.tips}>
            管理人へお気付き・ご意見をご記入ください。送信者秘匿での送信となるため、返答はいたしかねます。ご了承ください。
          </Text>
          <CustomInput 
            label="お気付き・ご意見"
            val={feedbackContent}
            setVal={setFeedbackContent}
            style={{height:400}}
            multiline={true}
            sessionName="feedback"
          />
        </CustomCard>
        <CustomButton
          title="送信"
          color={feedbackContent?"orange":"#dddddd"}
          disabledFun={feedbackContent?false:true}
          fun={sendFun}
        />
      </ScrollView>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  title: {
    marginVertical: 32,
    fontSize: 24
  },
  tips: {
    padding: 8
  }
})
