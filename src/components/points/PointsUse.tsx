import { Checkbox } from "react-native-paper"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { pointType } from "@/src/types/types"
import { useContext, useState } from "react"
import { AuthContext } from "@/src/context/loginContext"
import createAxiosClient from "@/utils/axiosClient"
import CustomCard from "../parts/CustomCard"

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
    <CustomCard>
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="numeric-2-box" size={20} color='orange' />
        <Text style={{ color: 'orange' }}>ハートポイントを使う</Text>
      </View>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
        onPress={() => setCheck(!check)}
        disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
        activeOpacity={0.7}
      >
        <Checkbox
          status={check ? 'checked' : 'unchecked'}
          onPress={() => setCheck(!check)}
          color="orange"
          disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
        />
        <Text style={{ flex: 1 }}>
          Amazonギフトカード(Eメールタイプ) 200円分 （200ポイント使用）
        </Text>
      </TouchableOpacity>
      {check && (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
          onPress={() => setCheckPolicy(!checkPolicy)}
          disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
          activeOpacity={0.7}
        >
          <Checkbox
            status={checkPolicy ? 'checked' : 'unchecked'}
            onPress={() => setCheckPolicy(!checkPolicy)}
            color="orange"
            disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
          />
          <Text style={{ flex: 1 }}>
            ギフトカードの発行のため、登録されたEmailアドレスをAmazonに提供することに同意する。(※Amazonギフトカードの受取人に指定されます)
          </Text>
        </TouchableOpacity>
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
    </CustomCard>
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
