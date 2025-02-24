import { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'
import { router } from 'expo-router'
// import Constants from "expo-constants"
// import * as Device from 'expo-device'
import BackgroundTemplate from '@/src/components/template/BackgroundTemplete'

export default function AdMobForData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null)

  // 開発中は使えない
  // const androidAdmobRewarded = Constants.expoConfig?.extra?.ANDROID_UNIT_ID
  // const iosAdmobRewarded = Constants.expoConfig?.extra?.IOS_UNIT_ID
  // const productionID = Device.osName === 'Android' ? androidAdmobRewarded : iosAdmobRewarded
  // const adUnitId = __DEV__ ? TestIds.REWARDED : productionID
  const adUnitId = TestIds.REWARDED

  function loadFun () {
    setLoading(true)

    // インスタンス作成
    const newRewarded = RewardedAd.createForAdRequest(adUnitId
      // // 開発中は使えない
      // , {
      // keywords: ['fashion', 'clothing', 'gaming', 'education', 'fitness', 'food', 'market', 'medication'],
      // requestNonPersonalizedAdsOnly: true
      // }
    )
    // 読み込み後の処理
    const unsubscribeLoaded = newRewarded.addAdEventListener(
      RewardedAdEventType.LOADED, 
      () => {
        setLoaded(true)
        setLoading(false)
      }
    )
    // 広告視聴後の処理
    const unsubscribeEarned = newRewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD, 
      () => {
        router.replace('/t-data/data')
      }
    )

    try {
      newRewarded.load()
    } catch(err){
      console.error('Failed to load ad:', err)
      setLoading(false)
    }
    setRewarded(newRewarded)
    return () => {
      unsubscribeLoaded()
      unsubscribeEarned()
    }
  }

  return (
    <BackgroundTemplate>

      <Text style={styles.headerTitle}>数字で見る病院データ</Text>

      <Text style={styles.dialog}>
        HeartHospitalでは病院指標を基に独自フィルタリングし、令和3～5年度の各病院の手術情報を見やすく表やグラフにしました。病院指標とは、病院の診療実績や医療の質、安全性、効率性を測るためのデータを集計・分析し、客観的に評価するための基準や指標のことで、各病院が毎年公開されますので誰でも閲覧可能です。簡単に説明すると、「各病院でどんな手術を何件やっているか」がわかります。広告視聴後にご覧ください。
      </Text>

      <TouchableOpacity 
        disabled = {loading}
        onPress={() => {
          if(!loaded&&!loading) loadFun()
          if(loaded) rewarded?.show()
        }}
      >
        <Text style={[styles.button, {backgroundColor: loaded ? 'orange' : 'green'}]}>
          {loading?
            <ActivityIndicator size={"small"} color={'white'}/>
            : loaded? 
              '広告視聴して病院データを閲覧する'
              : '広告を読み込む'}
        </Text>
      </TouchableOpacity>

    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 36,
    marginHorizontal: 'auto',
    fontSize: 24
  },
  dialog: {
    margin: 32,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
    padding: 16,
    color: 'gray'
  },
  button: {
    color: 'white',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    textAlign: 'center',
    marginBottom: 36
  }
})

// // Expo Go用
// import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
// import { router } from "expo-router"
// import { StyleSheet, Text, TouchableOpacity } from "react-native"

// export default function AdMob () {
//     return (
//       <BackgroundTemplate>
//         <TouchableOpacity onPress={()=>{router.replace('/t-data/data')}}>
//           <Text style={styles.button}>ダミーページ（要修正）</Text>
//         </TouchableOpacity>
//       </BackgroundTemplate>
        
//     )
// }
// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: 'orange',
//     color: 'white',
//     paddingTop: 4,
//     paddingBottom: 8,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     fontSize: 16
//   }
// })
