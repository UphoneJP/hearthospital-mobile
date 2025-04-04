import { Alert, StyleSheet, Text, View } from "react-native"
import { RadioButton } from 'react-native-paper'
import { useContext, useEffect, useState } from "react"
import createAxiosClient from "@/utils/axiosClient"
import { AuthContext } from "../../context/loginContext"

export default function Notify () {
  const [checked, setChecked] = useState('notify')
  const { user } = useContext(AuthContext)

  useEffect(()=>{
    if(!user?.notify){
      setChecked('not-notify')
    }
  }, [])

  async function changeToNotify () {
    if(checked === 'notify') return
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.get(`/api/user/${user?._id}/notifyTrue`)
      if(response?.data.success){
        setChecked('notify')
        Alert.alert('通知設定を「メールで通知する」に変更しました。')
      }
    } catch {
      Alert.alert('エラーが発生しました')
    }
  }

  async function changeToNotNotify () {
    if(checked === 'not-notify') return
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.get(`/api/user/${user?._id}/notifyFalse`)
      if(response?.data.success){
        setChecked('not-notify')
        Alert.alert('通知設定を「通知しない」に変更しました。')
      }
    } catch {
      Alert.alert('エラーが発生しました')
    }
  }

  return (
    <View>

      <Text style={{fontWeight:'bold'}}>
        ダイレクトメッセージを受信したら: 
      </Text>

      <View style={styles.radioAndText}>
        <RadioButton
          value="notify"
          status={ checked === 'notify' ? 'checked' : 'unchecked' }
          onPress={changeToNotify}
        />
        <Text onPress={changeToNotify}>
          メールで通知する
        </Text>
      </View>
      
      <View style={styles.radioAndText}>
        <RadioButton
          value="not-notify"
          status={ checked === 'not-notify' ? 'checked' : 'unchecked' }
          onPress={changeToNotNotify}
        />
        <Text onPress={changeToNotNotify}>
          通知しない
        </Text>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  radioAndText: {
    flexDirection: 'row', 
    alignItems: 'center'
  }
})
