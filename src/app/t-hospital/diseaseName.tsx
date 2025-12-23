import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { TextInput } from 'react-native-paper'

import { type reviewType } from "@/src/types/types"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import ReviewsBox from "@/src/components/review/ReviewsBox"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"
import { getData } from "@/utils/asyncStorage"

export default function DiseaseName () {
  const [inputVal, setInputVal] = useState<string>('')
  const [reviews, setReviews] = useState<reviewType[]>([])
  const [reviewsCopy, setReviewsCopy] = useState<reviewType[]>([])
  const [diseases, setDiseases] = useState<string[]>([])
  const [diseasesCopy, setDiseasesCopy] = useState<string[]>([])
  const params = useSearchParams()
  const disease = decodeURIComponent(params.get('disease') || '')
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  useEffect(()=>{
    async function fetchHospitals(){
      try {
        setServerLoading(true)
        setLoadingPercentage(0)
        const loadReviews = await getData('reviews')
        if(loadReviews){
          setReviews(JSON.parse(loadReviews))
          setReviewsCopy(JSON.parse(loadReviews))
          const allDiseases = JSON.parse(loadReviews).map((review: { diseaseNames: string[] }) => review.diseaseNames).flat()
          setDiseases([...new Set<string>(allDiseases)])
          setDiseasesCopy([...new Set<string>(allDiseases)])
          setInputVal(disease)
        } else {
          await backToHome("情報の取得に失敗しました。ホーム画面へ戻ります。")
        }
        setServerLoading(false)
      } catch {
        setServerLoading(false)
        await backToHome("情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    fetchHospitals()
  }, [])

  useEffect(()=>{
    if(inputVal!==''){
      setDiseases(diseasesCopy.filter(disease=>disease.includes(inputVal)))
      setReviews(reviewsCopy.filter(review=>review.diseaseNames.join('').includes(inputVal)))
    } else {
      setDiseases(diseasesCopy)
      setReviews(reviewsCopy)
    }
  }, [inputVal, diseasesCopy, reviewsCopy])

  return (
    <BackgroundTemplate>
      <View style={{paddingHorizontal: 36, paddingTop: 24, height: 100, width: '100%'}}>
        <TextInput
          placeholder='検索したい病名を入力'
          value={inputVal}
          onChangeText={(text)=>setInputVal(text)}
          left={<TextInput.Icon icon="magnify" />}
          right={
            inputVal &&
              <TextInput.Icon
                icon="close"
                onPress={() => setInputVal('')}
              />
          }
        />
      </View>

      <DiseasesBox diseases={diseases} setInputVal={setInputVal}/>
      
      <ScrollView style={styles.scrollBox}>
        <ReviewsBox reviews={reviews} setInputVal={setInputVal} />
        <View style={{padding:64}} />
      </ScrollView>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  scrollBox: {
    width: '100%'
  }
})
