import { StyleSheet, ActivityIndicator, Text, Image, View } from "react-native"
import { NativeAd, TestIds, NativeAdView, NativeMediaView, NativeAsset, NativeAssetType } from "react-native-google-mobile-ads"
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

      <View style={styles.explanation}>
        {/* アイコン */}
        {nativeAd.icon && (
          <NativeAsset assetType={NativeAssetType.ICON}>
            <Image source={{uri: nativeAd.icon.url}} width={16} height={16} />
          </NativeAsset>
        )}
        <View style={{flexDirection: 'row'}}>
          {/* 広告の帰属表示 */}
          <Text style={styles.budge}>Ad</Text>
          
          {/* 広告のタイトル */}
          <NativeAsset assetType={NativeAssetType.HEADLINE}>
            <Text style={{fontSize: 12}}>
              {nativeAd.headline}
            </Text>
          </NativeAsset>
        </View>
      </View>
    </NativeAdView>
  )
}

const styles = StyleSheet.create({
  adMedia: {
    width: "100%"
  },
  explanation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 16
  },
  budge: {
    backgroundColor: 'orange',
    color: 'white',
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 12
  }
})
