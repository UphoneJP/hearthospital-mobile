import { useSearchParams } from "expo-router/build/hooks"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text } from "react-native"

import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import AddButton from "@/src/components/parts/AddButton"
import { type talkThemeType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import TalkForm from "@/src/components/review/TalkForm"
import Talks from "@/src/components/review/Talks"

export default function eachTheme() {
  const [talkTheme, setTalkTheme] = useState<talkThemeType|undefined>(undefined)
  const [inputVisible, setInputVisible] = useState<boolean>(false)
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [num, setNum] = useState<number>(0)

  const params = useSearchParams()
  const id = params.get('id')
  
  useEffect(()=>{
    axiosClient.get(`/api/talkingRoom/${id}`)
    .then((response)=>{
      setTalkTheme(response.data.talkTheme)
      setLoading(false)
    })
    .catch(()=> Alert.alert('データが取得できませんでした。'))
  }, [num])

  if(loading&&talkTheme){
    return (
      <BackgroundTemplate>
        <ActivityIndicator/>
      </BackgroundTemplate>
    )
  }

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

      {inputVisible&&(
        <TalkForm 
          talkTheme={talkTheme} 
          setNum={setNum}
          setInputVisible={setInputVisible}
          setAddButtonVisible={setAddButtonVisible}
        />
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
