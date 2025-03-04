/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-irregular-whitespace */
import { useContext, useEffect, useState } from "react"
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import { Card, CheckBox } from "@rneui/themed"
import {MaterialCommunityIcons} from '@expo/vector-icons'

import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import BannerAds from "@/src/components/template/BannerAds"
import EarningPoints from "@/src/components/template/EarningPoints"
import { AuthContext } from "@/src/context/loginContext"
import { pointType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"

export default function Points() {
  const { user, setUser } = useContext(AuthContext)
  const [check, setCheck] = useState(false)
  const [spentTime, setSpentTime] = useState<number>(0)
  const remainingTime = 1000 * 60 * 60 * 23 - spentTime
  const canWatchAd = remainingTime <= 0

  const hours = Math.floor(remainingTime / (1000 * 60 * 60))
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)

  useEffect(() => {
    if (user?.timeOfGotPoint) {
      const updateSpentTime = () => {
        setSpentTime(new Date().getTime() - new Date(user.timeOfGotPoint).getTime())
      }
      updateSpentTime()
      const intervalId = setInterval(updateSpentTime, 1000)
      return () => clearInterval(intervalId)
    }
  }, [user?.timeOfGotPoint])

  function alerting(){
    if(!check){
      Alert.alert('交換する品を選択してください。')
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
      const response = await axiosClient.post('/api/user/usingPoints', {userId: user?._id})
      setUser(response.data.user)
      Alert.alert(
        'お申込みありがとうございます。交換申請をしました。',
        '数日中に当モバイルアプリのメッセージBOXにてご連絡いたします。しばらくお待ちください。'
      )
    } catch {
      Alert.alert('エラーが発生し、申請できませんでした。')
    }
  }

  return (
      <BackgroundTemplate>
        <ScrollView style={{width: '100%'}}>
          {/* ヘッダー */}
          <Text style={styles.title}>ポイ活</Text>
          <Text style={styles.subTitle}>ハートポイントを集めて交換しよう！</Text>
          <View style={styles.userPoints}>
            <Text style={{ fontWeight: "bold" }}>
              {user?.penName || user?.username}さんの保有ハートポイント:　
            </Text>
            <Text style={styles.point}>
              {user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0} pts
            </Text>
          </View>
          <Image 
            source={require('../../../assets/heartonOnly.png')}
            style={styles.hearton}
          />

          {/* ハートポイント利用規約 */}
          <TouchableOpacity onPress={()=>router.push('/others/pointsPolicy')}>
            <Text style={styles.pointsPolicy}>
              ハートポイント利用規約
            </Text>
          </TouchableOpacity>

          {/* ①ポイントGET */}
          <Card containerStyle={{borderRadius: 16}}>
            <Card.Title style={{color: 'orange'}}>
              <MaterialCommunityIcons name="numeric-1-box" size={20} />
              ハートポイントをGET
            </Card.Title>
            {!user?.points.length || canWatchAd ? (
              <EarningPoints />
            ) : (
              <>
                <Text style={{textAlign: 'center'}}>広告視聴が可能になるまで</Text>
                <Text style={styles.remainingTime}>{hours}時間 {minutes}分 {seconds}秒</Text>            
              </>
            )}
          </Card>

          {/* ②ポイント消費 */}
          <Card containerStyle={{borderRadius: 16}}>
            <Card.Title style={{color: 'orange'}}>
              <MaterialCommunityIcons name="numeric-2-box" size={20} />
              ハートポイントを使う
            </Card.Title>
            <Text>（200ポイント使用）</Text>
            <CheckBox
              checked={check}
              onPress={() => setCheck(!check)}
              checkedColor="orange"
              title="Amazonデジタルギフトカード200円分"
              disabled={(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 }
            />

            {(user?.points.map((point: pointType) => point.reward).reduce((sum, num) => sum + num, 0) || 0) < 200 ? (
              <Text style={{textAlign: 'center', color: 'red'}}>
                ポイントが不足しています。
              </Text>
            ) : (
              <TouchableOpacity onPress={alerting}>
                <Text style={[styles.button, {backgroundColor: 'orange'}]}>
                  ハートポイントを使う
                </Text>
              </TouchableOpacity>
            )}
          </Card>

          <View style={{padding: 64}}/>
        </ScrollView>

        <View style={{position: 'absolute', bottom: 0}}>
          <BannerAds />
        </View>

      </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 8
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 20
  },
  userPoints: { 
    flexDirection: "row", 
    justifyContent: 'center',
    marginVertical: 16
  },
  point: {
    color: 'red', 
    fontWeight: 'bold', 
    fontSize: 20,
    textDecorationLine: 'underline'
  },
  remainingTime: {
    fontSize: 20,
    marginVertical: 16,
    textAlign: 'center',
    color: 'orange',
    fontWeight: 'bold'
  },
  hearton: {
    width: 200, 
    height: 200, 
    objectFit: 'contain', 
    margin: 'auto'
  },
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
  },
  pointsPolicy: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
    borderRadius: 16,
    width: 200,
    margin: 'auto'
  }
})
