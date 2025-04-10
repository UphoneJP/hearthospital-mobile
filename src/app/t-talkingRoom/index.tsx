import { useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ActivityIndicator, Alert, ScrollView } from "react-native"
import { PaperProvider, Text } from 'react-native-paper'

import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { talkThemeType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import NewTalkThemeBox from "@/src/components/review/NewTalkThemeBox"
import TalkThemes from "@/src/components/review/TalkThemes"
import BannerAds from "@/src/components/template/BannerAds"

export default function TalkingRoom () {
  const [loading, setLoading]= useState<boolean>(true)
  const [talkThemes, setTalkThemes] = useState<talkThemeType[]>([])
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)  
  const [num, setNum] = useState<number>(0)
  function showDialog() { setDialogVisible(true) }
  
  useEffect(()=>{
    async function fetchTalkThemes(){
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/talkingRoom')
        setTalkThemes(response?.data.talkThemes)
      } catch {
        Alert.alert('データを取得できませんでした。')
      }
    }
    fetchTalkThemes()
  }, [num])

  useEffect(() => {
    if(talkThemes && talkThemes.length !== 0) { setLoading(false) }
  }, [talkThemes])

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

        {loading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="orange" />
            <Text style={{textAlign: 'center'}}>サーバーから読み込み中...</Text>
            <View style={{padding: 64}} />
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollBox} 
            contentContainerStyle={styles.scrollContent}
          >
            <TalkThemes 
              talkThemes={talkThemes} 
              setNum={setNum}
            />
            <View style={{padding: 64}} />
          </ScrollView>
        )}

        
        <View style={{position: 'absolute', bottom: 0}}>
          <BannerAds />
        </View>
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
  }
})
