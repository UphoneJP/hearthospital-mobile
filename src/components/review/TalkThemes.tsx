/* eslint-disable @typescript-eslint/no-require-imports */
import { AuthContext } from "@/src/context/loginContext"
import { talkThemeType } from "@/src/types/types"
import { router } from "expo-router"
import { Fragment, useContext, useEffect, useState } from "react"
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Platform, StatusBar } from 'react-native'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads'
import Constants from "expo-constants"
import * as Device from "expo-device"

// interstitial広告
const androidAdmobInterstitial = Constants.expoConfig?.extra?.INTERSTITIAL_ANDROID_UNIT_ID
const iosAdmobInterstitial = Constants.expoConfig?.extra?.INTERSTITIAL_IOS_UNIT_ID
const productionID = Device.osName === "Android" ? androidAdmobInterstitial : iosAdmobInterstitial
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : productionID
// const adUnitId = TestIds.INTERSTITIAL
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true
})

interface PropsType {
  setSelectedTalkTheme: React.Dispatch<React.SetStateAction<talkThemeType | null>>
  talkThemes: talkThemeType[]
  setEditDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteDialogVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function TalkThemes ({ talkThemes, setSelectedTalkTheme, setEditDialogVisible, setDeleteDialogVisible }: PropsType) {
  const { user } = useContext(AuthContext)
  const [loaded, setLoaded] = useState(false)
  const [loadingAd, setLoadingAd] = useState(false)
  const sortedTalkThemes = [...talkThemes].sort(
    (a, b) => new Date(b.touchAt).getTime() - new Date(a.touchAt).getTime()
  )

  // interstitial広告
  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => { 
      setLoaded(true) 
      setLoadingAd(false)
    })
    const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(true)
      }
    })
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (Platform.OS === 'ios') {
        StatusBar.setHidden(false)
      }
    })

    interstitial.load()
    return () => {
      unsubscribeLoaded()
      unsubscribeOpened()
      unsubscribeClosed()
    }
  }, [])

  // talkThemeのBOXを押したときの処理
  function handleTalkThemePress(talkTheme: talkThemeType) {
    if (loaded) {
      interstitial.show()
      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        setSelectedTalkTheme(talkTheme)
        router.push(`t-talkingRoom/${talkTheme._id}`)
        unsubscribeClosed()
      })
    } else {
      console.log('Ad not loaded yet')
      router.push(`t-talkingRoom/${talkTheme._id}`)
      if (!loadingAd) {
        setLoadingAd(true)
        interstitial.load()
      }
    }
  }

  return (
    <>
      {sortedTalkThemes.map(talkTheme => {        
        const touchDate = new Date(talkTheme.touchAt || "")
        const now = new Date()
        const thirtyDaysInMillis = 1000 * 60 * 60 * 24 * 30

        return (
          <Fragment key={talkTheme._id} >
            {/* talkThemeのBOX */}
            <TouchableOpacity
              style={styles.tBox}
              onPress={()=> handleTalkThemePress(talkTheme)}
              activeOpacity={0.6}
            >
              {/* 背景 */}
              <ImageBackground
                source={colorAssets[talkTheme.colorNum]}
                style={styles.background}
              >
                {/* タイトル */}
                <Text style={styles.title}>
                  {talkTheme.title}
                </Text>

                {/* 最新更新日 */}
                {now.getTime() - touchDate.getTime() < thirtyDaysInMillis &&
                  <Text style={styles.latest}>
                    {new Date(talkTheme.touchAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}更新
                  </Text>
                }

                {/* 詳細 */}
                <Text style={styles.detail}>{talkTheme.detail}</Text>

                {/* 編集・削除ボタン（トークテーマの作成者の場合のみ） */}
                {talkTheme.author === user?._id && (
                  <View style={styles.buttons}>
                    
                    <Text
                      style={[styles.deleteButton, {backgroundColor: 'blue'}]}
                      onPress={()=>{
                        setSelectedTalkTheme(talkTheme)
                        setEditDialogVisible(true)
                      }}
                    >
                      編集
                    </Text>

                    <Text
                      style={styles.deleteButton}
                      onPress={()=>{
                        setSelectedTalkTheme(talkTheme)
                        setDeleteDialogVisible(true)
                      }}
                    >
                      削除
                    </Text>

                  </View>
                )}
              </ImageBackground>
            </TouchableOpacity>
          </Fragment>
        )
      })}
    </>
  )
}
const colorAssets = [
  require('@/assets/colors/blue.jpg'),
  require('@/assets/colors/pink.jpg'),
  require('@/assets/colors/green.jpg'),
  require('@/assets/colors/yellow.jpg'),
  require('@/assets/colors/blue2.jpg'),
  require('@/assets/colors/pink2.jpg'),
  require('@/assets/colors/green2.jpg'),
  require('@/assets/colors/yellow2.jpg'),
  require('@/assets/colors/blue3.jpg'),
  require('@/assets/colors/pink3.jpg'),
  require('@/assets/colors/green3.jpg'),
  require('@/assets/colors/yellow3.jpg')
]
const styles = StyleSheet.create({
  tBox: {
    width: '50%',
    aspectRatio: 1
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    paddingTop: 16,
    paddingHorizontal: 4,
    fontSize: 16
  },
  latest: {
    color: 'red',
    textAlign: 'center'
  },
  detail: {
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#666666'
  },
  buttons: {
    flexDirection: 'row', 
    gap: 8, 
    justifyContent: 'center', 
    marginTop: 8
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
    width: 48,
    paddingBottom: 4,
    paddingTop: 2,
    borderRadius: 4
  }
})
