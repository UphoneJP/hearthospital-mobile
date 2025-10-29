import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { StyleSheet, Text } from "react-native"

import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import AddButton from "@/src/components/parts/AddButton"
import { type talkThemeType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import TalkForm from "@/src/components/review/TalkForm"
import Talks from "@/src/components/review/Talks"
import BannerAds from "@/src/components/template/BannerAds"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"

export default function eachTheme() {
  const [talkTheme, setTalkTheme] = useState<talkThemeType|undefined>(undefined)
  const [inputVisible, setInputVisible] = useState<boolean>(false)
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(true)
  const [num, setNum] = useState<number>(0)
  const {setServerLoading} = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  const params = useSearchParams()
  const id = params.get('id')
  
  useEffect(()=>{
    async function fetchTalkTheme(){
      setServerLoading(true)
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get(`/api/talkingRoom/${id}`)
        setTalkTheme(response?.data.talkTheme)
        // setLoading(false)
      } catch {
        await backToHome('データが取得できませんでした。ホーム画面へ戻ります。')
      }
      setServerLoading(false)
    }
    fetchTalkTheme()
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
