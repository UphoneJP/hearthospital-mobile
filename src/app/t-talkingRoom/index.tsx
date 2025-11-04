import { useContext, useEffect, useState } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import { Text } from 'react-native-paper'

import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { talkThemeType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import TalkThemes from "@/src/components/review/TalkThemes"
import BannerAds from "@/src/components/template/BannerAds"
import { router } from "expo-router"
import { AuthContext } from "@/src/context/loginContext"
import CustomDialog from "@/src/components/parts/CustomDialog"
import { LoadingContext } from "@/src/context/loadingContext"

export default function TalkingRoom () {
  const [talkThemes, setTalkThemes] = useState<talkThemeType[]>([])
  const [num, setNum] = useState<number>(0)
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const { user } = useContext(AuthContext)
  const {serverLoading, setServerLoading} = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  
  useEffect(()=>{
    async function fetchTalkThemes(){
      setServerLoading(true)
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/talkingRoom')
        setTalkThemes(response?.data.talkThemes)
      } catch {
        await backToHome()
      }
    }
    fetchTalkThemes()
  }, [num])

  useEffect(() => {
    if(talkThemes && talkThemes.length !== 0) { setServerLoading(false) }
  }, [talkThemes])

  return (
    <BackgroundTemplate>
      
      {!serverLoading && (
        <>
          <Text style={styles.headerTitle}>おしゃべり場</Text>
          <TouchableOpacity 
            onPress={() => {
              if(!user) { 
                setDialogVisible(true)
              } else {
                router.push('/t-talkingRoom/createNewTheme')
              }
            }}
          >
            <Text style={styles.create}>新しいトークテーマを作る</Text>
          </TouchableOpacity>
          <CustomDialog
            dialogVisible={dialogVisible}
            setDialogVisible={setDialogVisible}
          />

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
        </>
      )}
      
      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>
    </BackgroundTemplate>
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
