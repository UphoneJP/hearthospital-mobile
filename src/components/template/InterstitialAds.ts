import { useContext, useEffect, useState } from "react"
import Constants from "expo-constants"
import * as Device from "expo-device"
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads"
import { router } from "expo-router"
import { Platform, StatusBar } from "react-native"
import { AuthContext } from "@/src/context/loginContext"

const androidAdmobInterstitial = Constants.expoConfig?.extra?.INTERSTITIAL_ANDROID_UNIT_ID
const iosAdmobInterstitial = Constants.expoConfig?.extra?.INTERSTITIAL_IOS_UNIT_ID
const productionID = Device.osName === "Android" ? androidAdmobInterstitial : iosAdmobInterstitial
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : productionID

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true
})

export default function useInterstitialAd () {
  const [loaded, setLoaded] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if(user){
      const unsubscribeLoaded = interstitialAd.addAdEventListener(
        AdEventType.LOADED, 
        () => { 
          setLoaded(true)
        }
      )
      const unsubscribeOpened = interstitialAd.addAdEventListener(
        AdEventType.OPENED, 
        () => {
          if (Platform.OS === 'ios') {
            StatusBar.setHidden(true)
          }
        }
      )
      const unsubscribeClosed = interstitialAd.addAdEventListener(
        AdEventType.CLOSED, 
        () => {
          if (Platform.OS === 'ios') {
            StatusBar.setHidden(false)
          }
        }
      )
      interstitialAd.load()
      return () => {
        unsubscribeLoaded()
        unsubscribeOpened()
        unsubscribeClosed()
      }
    }
  }, [user])

  function showInterstitial() {
    if (loaded) {
      interstitialAd.show()
      interstitialAd.addAdEventListener(
        AdEventType.CLOSED, 
        () => { router.replace("/user/points") }
      )
    } else {
      router.replace("/user/points")
    }
  }

  return { showInterstitial }
}
