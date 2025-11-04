import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { TextInput } from 'react-native-paper'

import { type reviewType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import ReviewsBox from "@/src/components/review/ReviewsBox"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"

export default function DiseaseName () {
  const [inputVal, setInputVal] = useState<string>('')
  const [reviews, setReviews] = useState<reviewType[]>([])
  const [reviewsCopy, setReviewsCopy] = useState<reviewType[]>([])
  const [diseases, setDiseases] = useState<string[]>([])
  const [diseasesCopy, setDiseasesCopy] = useState<string[]>([])
  const params = useSearchParams()
  const disease = decodeURIComponent(params.get('disease') || '')
  const { setServerLoading } = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  useEffect(()=>{
    async function getAxiosClient(){
      try {
        setServerLoading(true)
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital/reviews')
        setReviews(response?.data.reviews)
        setReviewsCopy(response?.data.reviews)
        setServerLoading(false)
        const allDiseases = response?.data.reviews.map((review: { diseaseNames: string[] }) => review.diseaseNames).flat()
        setDiseases([...new Set<string>(allDiseases)])
        setDiseasesCopy([...new Set<string>(allDiseases)])
        setInputVal(disease)
      } catch {
        await backToHome("データベースの取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    getAxiosClient()
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
