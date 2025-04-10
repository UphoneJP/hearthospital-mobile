/* eslint-disable @typescript-eslint/no-require-imports */
import { AuthContext } from "@/src/context/loginContext"
import { talkThemeType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { Fragment, useContext, useEffect, useRef, useState } from "react"
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button, Dialog, Portal, TextInput } from "react-native-paper"
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
  talkThemes: talkThemeType[]
  setNum: React.Dispatch<React.SetStateAction<number>>
}
export default function TalkThemes ({ talkThemes, setNum }: PropsType) {
  const { user } = useContext(AuthContext)
  const [loaded, setLoaded] = useState(false)
  const [loadingAd, setLoadingAd] = useState(false)
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false)
  const titleRef = useRef<string>("")
  const detailRef = useRef<string>("")
  const inputRef = useRef<React.ElementRef<typeof TextInput> | null>(null)
  const detailInputRef = useRef<React.ElementRef<typeof TextInput> | null>(null)
  const [talkThemeToEdit, setTalkThemeToEdit] = useState<talkThemeType | null>(null)
  const [talkThemeToDelete, setTalkThemeToDelete] = useState<talkThemeType | null>(null)
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

  // editDialogを表示
  useEffect(() => {
    if (talkThemeToEdit) {
      titleRef.current = talkThemeToEdit.title
      detailRef.current = talkThemeToEdit.detail
      setEditDialogVisible(true)
      setTalkThemeToEdit(null)
    }
  }, [talkThemeToEdit])
  
  async function editFun(){
    try {
      const talkThemeEdit = titleRef.current.trim()
      const detailEdit = detailRef.current.trim()
      if(!talkThemeEdit || !detailEdit){
        Alert.alert('タイトルと説明の両方を記述してください')
        return
      }
      const axiosClient = await createAxiosClient()
      await axiosClient?.patch(`/api/talkingRoom/${talkThemeToEdit?._id}`, { talkThemeEdit, detailEdit })
      setEditDialogVisible(false)
      setNum((prev)=>prev + 1)
      Alert.alert('編集が完了しました')
    } catch {
      Alert.alert('エラーで編集できませんでした')
    }
  }

  async function deleteFun() {
    try {
      const axiosClient = await createAxiosClient()
      await axiosClient?.post(`/api/talkingRoom/${talkThemeToDelete?._id}`, {user})
      setDeleteDialogVisible(false)
      setNum((prev)=>prev + 1)
      Alert.alert('トークテーマを削除しました')
    } catch {
      Alert.alert('エラー', '削除できませんでした')
    }
  }

  const handleTalkThemePress = (talkThemeId: string) => {
    if (loaded) {
      interstitial.show()
      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        router.push(`t-talkingRoom/${talkThemeId}`)
        unsubscribeClosed()
      })
    } else {
      console.log('Ad not loaded yet')
      router.push(`t-talkingRoom/${talkThemeId}`)
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
        const threeDaysInMs = 1000 * 60 * 60 * 24 * 30

        return (
          <Fragment key={talkTheme._id} >
            <TouchableOpacity
              style={styles.tBox}
              onPress={()=> handleTalkThemePress(talkTheme._id)}
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
                      onPress={()=>setTalkThemeToEdit(talkTheme)}
                    >
                      編集
                    </Text>

                    <Text
                      style={styles.deleteButton}
                      onPress={()=>{
                        setTalkThemeToDelete(talkTheme)
                        setDeleteDialogVisible(true)
                    }}
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
                  <Text style={{color: 'orange'}}>タイトル</Text>
                  <TextInput
                    mode="outlined"
                    onChangeText={text => titleRef.current = text}
                    ref={input => inputRef.current = input}
                    autoFocus
                    outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                    contentStyle={{color: 'orange'}}
                    theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
                    placeholder={titleRef.current}
                  />
                  <Text style={{color: 'orange'}}>説明</Text>
                  <TextInput
                    mode="outlined"
                    onChangeText={text => detailRef.current = text}
                    ref={input => detailInputRef.current = input}
                    style={{height: 120}}
                    multiline
                    outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
                    contentStyle={{color: 'orange'}}
                    theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
                    placeholder={detailRef.current}
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
