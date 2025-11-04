import { useEffect } from "react"
import { View } from "react-native"
import { BannerAd, BannerAdSize, TestIds, MobileAds } from "react-native-google-mobile-ads"
import Constants from "expo-constants"
import * as Device from 'expo-device'

export default function BannerAds() {
  const androidAdmobBanner = Constants.expoConfig?.extra?.BANNER_ANDROID_UNIT_ID
  const iosAdmobBanner = Constants.expoConfig?.extra?.BANNER_IOS_UNIT_ID
  const productionID = Device.osName === 'Android' ? androidAdmobBanner : iosAdmobBanner
  const adUnitId = __DEV__ ? TestIds.BANNER : productionID
  // const adUnitId =TestIds.BANNER

  useEffect(() => {
    MobileAds().initialize()
  }, [])

  return (
    <View style={{ alignItems: "center" }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{requestNonPersonalizedAdsOnly: true}}
      />
    </View>
  )
}
