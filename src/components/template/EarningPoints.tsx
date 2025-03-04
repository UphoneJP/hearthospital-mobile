import { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from "react-native"
import Constants from "expo-constants"
import * as Device from 'expo-device'
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'
import axiosClient from "@/utils/axiosClient"
import { AuthContext } from "@/src/context/loginContext"

export default function EarningPoints() {
  const { user, setUser } = useContext(AuthContext)
  const [ad1, setAd1] = useState<RewardedAd|undefined>(undefined)
  const [loading1, setLoading1] = useState<boolean>(false)
  const [done1, setDone1] = useState<boolean>(false)

  const [ad2, setAd2] = useState<RewardedAd|undefined>(undefined)
  const [loading2, setLoading2] = useState<boolean>(false)
  const [done2, setDone2] = useState<boolean>(false)

  const [ad3, setAd3] = useState<RewardedAd|undefined>(undefined)
  const [loading3, setLoading3] = useState<boolean>(false)
  const [done3, setDone3] = useState<boolean>(false)

  const androidAdmobRewarded = Constants.expoConfig?.extra?.REWARDED_ANDROID_UNIT_ID
  const iosAdmobRewarded = Constants.expoConfig?.extra?.REWARDED_IOS_UNIT_ID
  const productionID = Device.osName === 'Android' ? androidAdmobRewarded : iosAdmobRewarded
  const adUnitId = __DEV__ ? TestIds.REWARDED : productionID

  useEffect(()=>{
    if( ad1 !== undefined ){
      const unsubscribeLoaded = ad1.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => { ad1.show() }
      )
      const unsubscribeEarned = ad1.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD, 
        () => { setDone1(true) }
      )
      try {
        ad1.load()
      } catch {
        Alert.alert('広告を読み込めませんでした。再度お試しください。')
        setLoading1(false)
      }
      return () => {
        unsubscribeLoaded()
        unsubscribeEarned()
      }
    }
  }, [ad1])

  useEffect(()=>{
    if( ad2 !== undefined ){
      const unsubscribeLoaded = ad2.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => { ad2.show() }
      )
      const unsubscribeEarned = ad2.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD, 
        () => { setDone2(true) }
      )
      try {
        ad2.load()
      } catch {
        Alert.alert('広告を読み込めませんでした。再度お試しください。')
        setLoading2(false)
      }
      return () => {
        unsubscribeLoaded()
        unsubscribeEarned()
      }
    }
  }, [ad2])

  useEffect(()=>{
    if( ad3 !== undefined ){
      const unsubscribeLoaded = ad3.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => { ad3.show() }
      )
      const unsubscribeEarned = ad3.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD, 
        () => { setDone3(true) }
      )
      try {
        ad3.load()
      } catch {
        Alert.alert('広告を読み込めませんでした。再度お試しください。')
        setLoading3(false)
      }
      return () => {
        unsubscribeLoaded()
        unsubscribeEarned()
      }
    }
  }, [ad3])

  function loadFun (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>, 
    setAd: React.Dispatch<React.SetStateAction<RewardedAd | undefined>>
  ) {
    setLoading(true)
    setAd(RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true
    }))
  }

  async function earningPointFun() {
    try {
      const response = await axiosClient.post(`/api/user/${user?._id}/earningPoint`)
      setUser(response.data.user)
      Alert.alert('ハートポイントを2ポイント獲得しました!')
    } catch {
      Alert.alert('エラーが発生しポイントを追加できませんでした')
    }
  }
  
  return (
    <>
      <Text style={{textAlign: 'center', marginBottom: 16}}>
        ( 動画広告を3回見ると2ポイントGET!! )
      </Text>

      <TouchableOpacity
        disabled = {loading1}
        onPress={() => loadFun(setLoading1, setAd1)}
      >
        <Text style={[styles.button, {backgroundColor: done1 ? 'gray': 'orange'}]} disabled={loading1}>
          {!done1? (
            !loading1 ? (
              '広告視聴（1回目）'
            ) : (
              <ActivityIndicator size="small" color='white'/>
            )
          ) : (
            '視聴完了!!（1回目）'
          )}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled = {loading2}
        onPress={() => loadFun(setLoading2, setAd2)}
        >
        <Text style={[styles.button, {backgroundColor: done2 ? 'gray': 'orange'}]} disabled={loading2}>
          {!done2? (
            !loading2 ? (
              '広告視聴（2回目）'
            ) : (
              <ActivityIndicator size="small" color='white'/>
            )
          ) : (
            '視聴完了!!（2回目）'
          )}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        disabled = {loading3}
        onPress={() => loadFun(setLoading3, setAd3)}
        >
        <Text style={[styles.button, {backgroundColor: done3 ? 'gray': 'orange'}]} disabled={loading3}>
          {!done3? (
            !loading3 ? (
              '広告視聴（3回目）'
            ) : (
              <ActivityIndicator size="small" color='white'/>
            )
          ) : (
            '視聴完了!!（3回目）'
          )}
        </Text>
      </TouchableOpacity>

      {done1 && done2 && done3 &&
        <TouchableOpacity onPress={earningPointFun}>
          <Text style={[styles.button, {backgroundColor: 'orange'}]}>
            ハートポイント2pointを獲得する
          </Text>
        </TouchableOpacity>
      }
    </>
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
