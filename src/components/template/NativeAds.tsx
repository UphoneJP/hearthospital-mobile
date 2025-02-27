import { StyleSheet, ActivityIndicator } from "react-native"
import { TestIds, NativeAdView, NativeMediaView, NativeAd } from "react-native-google-mobile-ads"
import Constants from "expo-constants"
import * as Device from "expo-device"
import { useEffect, useState } from "react"

export default function NativeAds() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null)

  const androidAdmobNative = Constants.expoConfig?.extra?.NATIVE_ANDROID_UNIT_ID
  const iosAdmobNative = Constants.expoConfig?.extra?.NATIVE_IOS_UNIT_ID
  const productionID = Device.osName === "Android" ? androidAdmobNative : iosAdmobNative
  const adUnitId = __DEV__ ? TestIds.NATIVE : productionID

  useEffect(() => {
    NativeAd.createForAdRequest(adUnitId)
      .then((ad) => setNativeAd(ad))
      .catch((error) => console.error("広告の読み込みに失敗:", error))
  }, [])

  if (!nativeAd) return <ActivityIndicator size="large" color="orange"/>

  return (
    <NativeAdView 
      nativeAd={nativeAd}
      style={styles.adMedia}
    >
      <NativeMediaView />
    </NativeAdView>
  )
}

const styles = StyleSheet.create({
  adMedia: {
    width: "100%",
    backgroundColor: '#dddddd'
  }
})
  