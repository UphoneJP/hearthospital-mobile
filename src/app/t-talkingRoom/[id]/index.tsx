import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { StyleSheet, Text } from "react-native"

import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import AddButton from "@/src/components/parts/AddButton"
import { type talkThemeType } from "@/src/types/types"
import TalkForm from "@/src/components/review/TalkForm"
import Talks from "@/src/components/review/Talks"
import BannerAds from "@/src/components/template/BannerAds"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"
import reloadInfo from "@/utils/reloadInfo"
import { getData } from "@/utils/asyncStorage"

export default function eachTheme() {
  const [talkTheme, setTalkTheme] = useState<talkThemeType|undefined>(undefined)
  const [inputVisible, setInputVisible] = useState<boolean>(false)
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(true)
  const [num, setNum] = useState<number>(0)
  const {setServerLoading, setLoadingPercentage} = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  const params = useSearchParams()
  const id = params.get('id')
  
  useEffect(()=>{
    async function fetchData(){
      try {
        setServerLoading(true)
        setLoadingPercentage(0)
        if(num!==0) await reloadInfo() // 投稿時のみサーバーに再取得

        const loadTalkThemes = await getData('talkThemes')
        if(loadTalkThemes){
          setTalkTheme(JSON.parse(loadTalkThemes).find((theme: talkThemeType)=>theme._id===id))
          setServerLoading(false)
        } else {
          setServerLoading(false)
          await backToHome("情報の取得に失敗しました。ホーム画面へ戻ります。")
        }
      } catch {
        setServerLoading(false)
        await backToHome("情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    fetchData()
  }, [num])

  return (
    <BackgroundTemplate>
      <Text style={styles.headerTitle}>
        {talkTheme?.title}
      </Text>
      <Text>
        閲覧数: {talkTheme?.accessCount}
      </Text>

      <Talks 
        talkTheme={talkTheme}
        id={id}
        setNum={setNum} 
      />
      
      <AddButton 
        setInputVisible={setInputVisible}
        addButtonVisible={addButtonVisible}
        setAddButtonVisible={setAddButtonVisible}
      />

      {inputVisible ? (
        <TalkForm 
          talkTheme={talkTheme} 
          setNum={setNum}
          setInputVisible={setInputVisible}
          setAddButtonVisible={setAddButtonVisible}
        />
      ) : (
        <BannerAds />
      )}
    
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    marginTop: 32,
    marginBottom: 8
  }
})
