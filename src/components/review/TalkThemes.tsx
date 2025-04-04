/* eslint-disable @typescript-eslint/no-require-imports */
import { AuthContext } from "@/src/context/loginContext"
import { talkThemeType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { Fragment, useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button, Dialog, Portal, TextInput } from "react-native-paper"
import { Platform, StatusBar } from 'react-native'
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads'
import Constants from "expo-constants"
import * as Device from "expo-device"

// const androidAdmobInterstitial = Constants.expoConfig?.extra?.INTERSTITIAL_ANDROID_UNIT_ID
// const iosAdmobInterstitial = Constants.expoConfig?.extra?.INTERSTITIAL_IOS_UNIT_ID
// const productionID = Device.osName === "Android" ? androidAdmobInterstitial : iosAdmobInterstitial
// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : productionID
const adUnitId = TestIds.INTERSTITIAL
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true
})

interface PropsType {
  talkThemes: talkThemeType[]
  setNum: React.Dispatch<React.SetStateAction<number>>
}
export default function TalkThemes ({ talkThemes, setNum }: PropsType) {
  const { user } = useContext(AuthContext)
  const [loaded, setLoaded] = useState(false)
  const [adError, setAdError] = useState<boolean>(false)
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false)
  const [talkThemeEdit, setTalkThemeEdit] = useState<string>('')
  const [detailEdit, setDetailEdit] = useState<string>('')
  const [selectedTalkTheme, setSelectedTalkTheme] = useState<talkThemeType | null>(null)
  const sortedTalkThemes = [...talkThemes].sort(
    (a, b) => new Date(b.touchAt).getTime() - new Date(a.touchAt).getTime()
  )

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => { 
      setLoaded(true) 
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
    const timer = setTimeout(() => {
      if (!loaded) {
        setAdError(true)
        setLoaded(true)
      }
    }, 10000)

    interstitial.load()
    return () => {
      unsubscribeLoaded()
      unsubscribeOpened()
      unsubscribeClosed()
      clearTimeout(timer)
    }
  }, [])

  function openEditDialog(talkTheme: talkThemeType) {
    setSelectedTalkTheme(talkTheme)
    setEditDialogVisible(true)
  }
  useEffect(() => {
    if (editDialogVisible && selectedTalkTheme) {
      setTalkThemeEdit(selectedTalkTheme.title)
      setDetailEdit(selectedTalkTheme.detail)
    }
  }, [editDialogVisible, selectedTalkTheme])
  async function editFun(){
    try {
      const axiosClient = await createAxiosClient()
      await axiosClient?.patch(`/api/talkingRoom/${selectedTalkTheme?._id}`, { talkThemeEdit, detailEdit })
      setEditDialogVisible(false)
      setNum((prev)=>prev + 1)
      Alert.alert('編集が完了しました')
    } catch {
      Alert.alert('エラーで編集できませんでした')
    }
  }

  function openDeleteDialog(talkTheme: talkThemeType) {
    setSelectedTalkTheme(talkTheme)
    setDeleteDialogVisible(true)
  }
  async function deleteFun(){
    try {
      const axiosClient = await createAxiosClient()
      await axiosClient?.post(`/api/talkingRoom/${selectedTalkTheme?._id}`, {user})
      setDeleteDialogVisible(false)
      setNum((prev)=>prev + 1)
      Alert.alert('トークテーマを削除しました')
    } catch {
      Alert.alert('エラーで削除できませんでした')
    }
  }

  if (!loaded) {
    return (
      <View style={{width: '100%', alignItems: 'center', marginTop: 64}}>
        <Text>データを取得中です</Text>
        <ActivityIndicator size="large" color="orange" />
      </View>
    )
  }

  return (
    <>
      {sortedTalkThemes.map(talkTheme => {        
        const touchDate = new Date(talkTheme.touchAt || "")
        const now = new Date()
        const threeDaysInMs = 1000 * 60 * 60 * 24 * 30

        return (
          <Fragment key={talkTheme._id} >
            <TouchableOpacity
              style={styles.tBox}
              onPress={()=> {
                if(!adError)interstitial.show()
                router.push(`t-talkingRoom/${talkTheme._id}`)
              }}
              activeOpacity={0.6}
            >
              <ImageBackground
                source={colorAssets[talkTheme.colorNum]}
                style={styles.background}
              >
                <Text style={styles.title}>{talkTheme.title}</Text>
                {now.getTime() - touchDate.getTime() < threeDaysInMs &&
                  <Text style={styles.latest}>
                    {new Date(talkTheme.touchAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}更新
                  </Text>
                }
                <Text style={styles.detail}>{talkTheme.detail}</Text>

                {talkTheme.author === user?._id && (
                  <View style={styles.buttons}>
                    <Text
                      style={[styles.deleteButton, {backgroundColor: 'blue'}]}
                      onPress={()=>openEditDialog(talkTheme)}
                    >
                      編集
                    </Text>

                    <Text
                      style={styles.deleteButton}
                      onPress={()=>openDeleteDialog(talkTheme)}
                    >
                      削除
                    </Text>
                  </View>
                )}
              </ImageBackground>
            </TouchableOpacity>

            {/* 編集画面 */}
            <Portal>
              <Dialog 
                visible={editDialogVisible} 
                onDismiss={()=>setEditDialogVisible(false)}
                style={{backgroundColor: 'white'}}
              >
                <Dialog.Title style={{color: 'orange', textAlign: 'center', fontSize: 20}}>
                  トークテーマを編集
                </Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    label="タイトル"
                    mode="outlined"
                    value={talkThemeEdit}
                    onChangeText={text => setTalkThemeEdit(text)}
                    autoFocus
                    outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                    contentStyle={{color: 'orange'}}
                    theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
                  />
                  <TextInput
                    label="説明"
                    mode="outlined"
                    value={detailEdit}
                    onChangeText={text => setDetailEdit(text)}
                    style={{height: 120}}
                    multiline
                    outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                    contentStyle={{color: 'orange'}}
                    theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button 
                    textColor="orange" 
                    onPress={editFun}
                  >
                    変更する
                  </Button>
                </Dialog.Actions>          
              </Dialog>
            </Portal>

            {/* 削除画面 */}
            <Portal>
              <Dialog 
                visible={deleteDialogVisible} 
                onDismiss={()=>setDeleteDialogVisible(false)}
                style={{backgroundColor: 'white'}}
              >
                <Dialog.Title style={{color: 'orange', textAlign: 'center', fontSize: 20}}>
                  トークテーマを編集
                </Dialog.Title>
                <Dialog.Content>
                  <Text>
                    トークテーマを削除します。トークテーマ内の全ての投稿が削除されます。よろしいですか？
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button 
                    textColor="orange" 
                    onPress={()=>setDeleteDialogVisible(false)}
                  >
                    キャンセル
                  </Button>
                  <Button 
                    textColor="red" 
                    onPress={deleteFun}
                  >
                    削除する
                  </Button>
                </Dialog.Actions>          
              </Dialog>
            </Portal>
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
