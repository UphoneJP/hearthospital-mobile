import CustomInput from "@/src/components/parts/CustomInput"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { useState } from "react"
import { Alert, StyleSheet, Text } from "react-native"
import { Card } from "@rneui/themed"
import { ScrollView } from "react-native-gesture-handler"
import RaisedButton from "@/src/components/parts/RaisedButton"
import axiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useTab } from "@/src/context/tabContext"

export default function Feedback(){
  const [feedbackContent, setFeedbackContent] = useState<string>('')
  const { onTabPress } = useTab()

  function sendFun(){
    axiosClient.post('/api/others/feedback', {feedbackContent})
    Alert.alert('フィードバックを送信いたしました。ご意見、ありがとうございます。')
    onTabPress('home')
    router.replace('/t-home')
  }

  return (
    <BackgroundTemplate>
      <Text style={styles.title}>フィードバック</Text>
      <ScrollView style={{width: '100%'}}>
        <Card containerStyle={styles.card}>
          <Text style={styles.tips}>
            お気付き・ご意見をご記入ください。返答はいたしませんのでご了承ください。
          </Text>
          <CustomInput 
            label="お気付き・ご意見"
            val={feedbackContent}
            setVal={setFeedbackContent}
            style={{height:400}}
            multiline={true}
          />
        </Card>
        <RaisedButton
          title="送信"
          color="green"
          disabled={feedbackContent?false:true}
          styleChange={styles.button}
          fun={sendFun}
        />
      </ScrollView>
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
  tips: {
    padding: 8
  },
  button: {
    marginVertical: 32,
    marginHorizontal: 64
  }
})
