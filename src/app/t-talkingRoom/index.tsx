import { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Alert, ScrollView } from "react-native"
import { PaperProvider, Text } from 'react-native-paper'

import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { talkThemeType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import NewTalkThemeBox from "@/src/components/review/NewTalkThemeBox"
import TalkThemes from "@/src/components/review/TalkThemes"
import NativeAds from "@/src/components/template/NativeAds"

export default function TalkingRoom () {
  const [loading, setLoading]= useState<boolean>(true)
  const [talkThemes, setTalkThemes] = useState<talkThemeType[]>([])
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)  
  const [num, setNum] = useState<number>(0)
  function showDialog() { setDialogVisible(true) }
  
  useEffect(()=>{
    axiosClient.get('/api/talkingRoom')
    .then((response)=>{
      setTalkThemes(response.data.talkThemes)
    })
    .catch(()=>{
      Alert.alert('データを取得できませんでした。')
    })
  }, [num])

  useEffect(() => {
    if(talkThemes) { setLoading(false) }
  }, [talkThemes])

  if(loading){
    return (
      <BackgroundTemplate>
        <ActivityIndicator size="large" color="orange" />
        <Text>サーバーから読み込み中...</Text>
      </BackgroundTemplate>
    )
  }

  return (
    <PaperProvider>
      <BackgroundTemplate>
        <Text style={styles.headerTitle}>おしゃべり場</Text>
        <TouchableOpacity onPress={showDialog}>
          <Text style={styles.create}>新しいトークテーマを作る</Text>
        </TouchableOpacity>

        <NewTalkThemeBox
          dialogVisible={dialogVisible}
          setDialogVisible={setDialogVisible}
          setNum={setNum}
        />

        <ScrollView 
          style={styles.scrollBox} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.adBox}>
            <NativeAds />
          </View>

          <TalkThemes 
            talkThemes={talkThemes} 
            setNum={setNum}
          />

        </ScrollView>
      </BackgroundTemplate>
    </PaperProvider>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 32,
    marginBottom: 8,
    fontSize: 24
  },
  create: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
    marginBottom: 12,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 8
  },
  scrollBox: {
    width:'100%',
    flex: 1
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  adBox: {
    width: '50%', 
    aspectRatio: 1, 
    justifyContent: 'center'
  }
})
