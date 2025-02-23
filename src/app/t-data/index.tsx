import { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'
import * as Device from 'expo-device'
import BackgroundTemplate from '@/src/components/template/BackgroundTemplete'
import { router } from 'expo-router'
import Constants from "expo-constants"

export default function AdMobForData() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null)

  const androidAdmobRewarded = Constants.expoConfig?.extra?.ANDROID_UNIT_ID
  const iosAdmobRewarded = Constants.expoConfig?.extra?.IOS_UNIT_ID
  const productionID = Device.osName === 'Android' ? androidAdmobRewarded : iosAdmobRewarded
  const adUnitId = __DEV__ ? TestIds.REWARDED : productionID

  function loadFun () {
    setLoading(true)

    // インスタンス作成
    const newRewarded = RewardedAd.createForAdRequest(adUnitId
      // //開発中は使えない
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
      <TouchableOpacity 
        disabled = {loading}
        onPress={() => {
          if(!loaded&&!loading) loadFun()
          if(loaded) rewarded?.show()
        }}
      >
        <Text style={styles.button}>
          {loading?
            <ActivityIndicator size={"small"} color={'white'}/>
            : loaded? '広告視聴して病院データを閲覧する': '広告を読み込む'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subText}>
        ※ ここでいう病院データとは、各病院が毎年公開する病院指標（手術をした患者人数等）から必要なデータのみを抽出し、独自フィルタリングしたデータを見やすくグラフ化したものです。
      </Text>

    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: 'orange',
    color: 'white',
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    textAlign: 'center'
  },
  subText: {
    color: '#666666',
    padding: 16,
    marginHorizontal: 16
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
