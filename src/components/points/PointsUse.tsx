import { Card, CheckBox } from "@rneui/themed"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native"
import { pointType } from "@/src/types/types"
import { useContext, useState } from "react"
import { AuthContext } from "@/src/context/loginContext"
import createAxiosClient from "@/utils/axiosClient"

export default function PointsUse () {
  const { user, setUser } = useContext(AuthContext)
  const [check, setCheck] = useState<boolean>(false)
  const [checkPolicy, setCheckPolicy] = useState<boolean>(false)
  
  function alerting(){
    if(!check){
      Alert.alert('交換する品を選択してください。')
      return
    }
    if(!checkPolicy){
      Alert.alert('ご登録Emailアドレスの提供に同意してください。')
      return
    }
    Alert.alert(
      'ハートポイントを使います。',
      '200ポイントを指定の品と交換しますか？',
      [
        {text: 'キャンセル', style: 'cancel'},
        {text: '交換する', onPress: usingPoints}
      ]
    )
  }

  async function usingPoints(){
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post('/api/user/usingPoints', {userId: user?._id})
      setUser(response?.data.user)
      Alert.alert(
        'お申込みありがとうございます。交換手続きを行います。',
        'ご指定の品はAmazonからご登録のEmailアドレス宛に送られます。しばらくお待ちください。'
      )
      setCheck(false)
      setCheckPolicy(false)
    } catch {
      Alert.alert('エラーが発生し、申請できませんでした。')
    }
  }

  return (
    <Card containerStyle={{borderRadius: 16}}>
      <Card.Title style={{color: 'orange', marginBottom: 0}}>
        <MaterialCommunityIcons name="numeric-2-box" size={20} />
        ハートポイントを使う
      </Card.Title>
      <CheckBox
        checked={check}
        onPress={() => setCheck(!check)}
        checkedColor="orange"
        title="Amazonギフトカード(Eメールタイプ)　200円分　（200ポイント使用）"
        disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
      />
      {check && (
        <CheckBox
          checked={checkPolicy}
          onPress={() => setCheckPolicy(!checkPolicy)}
          checkedColor="orange"
          title="ギフトカードの発行のため、登録されたEmailアドレスをAmazonに提供することに同意する"
          disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
        />
      )}

      {(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 ? (
        <Text style={{textAlign: 'center', color: 'red'}}>
          ポイントが不足しています。
        </Text>
      ) : (
        <TouchableOpacity onPress={alerting}>
          <Text style={[styles.button, {backgroundColor: 'orange'}]}>
            ハートポイントと交換申請する
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  )
}
const styles = StyleSheet.create({
  button: {
    color: 'white',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    textAlign: 'center',
    marginBottom: 16,
    margin: 'auto'
  }
})
