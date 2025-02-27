import Constants from "expo-constants"
import * as Device from 'expo-device'
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'
import { router } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from "react-native"

export default function RewardedAds() {
  const [loading, setLoading] = useState(false)

  const androidAdmobRewarded = Constants.expoConfig?.extra?.REWARDED_ANDROID_UNIT_ID
  const iosAdmobRewarded = Constants.expoConfig?.extra?.REWARDED_IOS_UNIT_ID
  const productionID = Device.osName === 'Android' ? androidAdmobRewarded : iosAdmobRewarded
  const adUnitId = __DEV__ ? TestIds.REWARDED : productionID

  function loadFun () {
    setLoading(true)

    // インスタンス作成
    const newRewarded = RewardedAd.createForAdRequest(adUnitId
      , { requestNonPersonalizedAdsOnly: true }
    )
    // 広告ロードの処理
    const unsubscribeLoaded = newRewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        newRewarded.show()
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
    } catch {
      Alert.alert('広告を読み込めませんでした。再度お試しください。')
      setLoading(false)
    }

    return () => {
      unsubscribeLoaded()
      unsubscribeEarned()
    }
  }
  
  return (
    <TouchableOpacity
      disabled = {loading}
      onPress={() => loadFun()}
    >
      <Text style={styles.button} disabled={loading}>
        {loading?
          <ActivityIndicator size="small" color='white'/>
          : '広告視聴して病院データを閲覧する'
        }
      </Text>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: 'orange',
    color: 'white',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    textAlign: 'center',
    marginBottom: 36
  }
})
