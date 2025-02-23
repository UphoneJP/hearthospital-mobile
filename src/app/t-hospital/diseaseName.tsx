import { useSearchParams } from "expo-router/build/hooks"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native"
import { Input, Icon } from '@rneui/themed'

import { type reviewType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import ReviewsBox from "@/src/components/review/ReviewsBox"

export default function DiseaseName () {
  const [inputVal, setInputVal] = useState<string>('')
  const [reviews, setReviews] = useState<reviewType[]>([])
  const [reviewsCopy, setReviewsCopy] = useState<reviewType[]>([])
  const [diseases, setDiseases] = useState<string[]>([])
  const [diseasesCopy, setDiseasesCopy] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const params = useSearchParams()
  const disease = decodeURIComponent(params.get('disease') || '')


  useEffect(()=>{
    axiosClient.get('/api/hospital/reviews')
    .then((response)=>{
      setReviews(response.data.reviews)
      setReviewsCopy(response.data.reviews)
      setLoading(false)
      const allDiseases = response.data.reviews.map((review: { diseaseNames: string[] }) => review.diseaseNames).flat()
      setDiseases([...new Set<string>(allDiseases)])
      setDiseasesCopy([...new Set<string>(allDiseases)])
      setInputVal(disease)
    })
    .catch(()=>{
      Alert.alert("病院情報の取得に失敗しました。")
    })
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
      {loading?(
        <ActivityIndicator size="large" color="#ff9500" />
      ) : (
        <>
          <Input
            placeholder='検索したい病名を入力'
            leftIcon={{ type: 'Ionicon', name: 'search' }}
            value={inputVal}
            onChangeText={(text)=>setInputVal(text)}
            containerStyle={{height:52,marginTop: 16}}
            rightIcon={
              <Icon
                type="MaterialIcons"
                name="clear"
                onPress={() => setInputVal('')}
                color={inputVal ? 'gray' : 'transparent'}
              />
            }
          />
          <DiseasesBox diseases={diseases} setInputVal={setInputVal}/>
          
          <ScrollView style={styles.scrollBox}>
            <ReviewsBox reviews={reviews} setInputVal={setInputVal} />
            <View style={{padding:64}} />
          </ScrollView>
        </>
      )}
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  resetButton: {
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#555555',
    backgroundColor: '#ffff00',
    paddingHorizontal: 8,
    paddingVertical: 0,
    color: '#555555',
    marginBottom: 16,
    flex:1
  },
  scrollBox: {
    width: '100%'
  }
})
