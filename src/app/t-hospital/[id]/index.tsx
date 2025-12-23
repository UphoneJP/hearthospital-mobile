import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Linking, TouchableOpacity, View } from "react-native"
import { Text } from "react-native"

import { hospitalType, reviewType } from "@/src/types/types"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import ReviewsBox from "@/src/components/review/ReviewsBox"
import AddButton from "@/src/components/parts/AddButton"
import HospitalMap from "@/src/components/review/HospitalMap"
import BannerAds from "@/src/components/template/BannerAds"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"
import { getData } from "@/utils/asyncStorage"

export default function HospitalDetail () {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [hospital, setHospital] = useState<hospitalType|undefined>(undefined)
  const [reviews, setReviews] = useState<reviewType[]>([])
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(true)
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  const website = () => {
    Linking.openURL(hospital?.url || 'https://www.hearthospital.jp')
  }
  const url = `/t-hospital/${id}/new`
  
  useEffect(()=>{
    async function fetchData(){
      try {
        setServerLoading(true)
        setLoadingPercentage(0)
        const loadHospitals = await getData('hospitals')
        const loadReviews = await getData('reviews')
        if(loadHospitals && loadReviews){
          setHospital(JSON.parse(loadHospitals).find((hosp: hospitalType)=>hosp._id===id))
          const reviewsOfThisHospital = JSON.parse(loadReviews).filter((review: reviewType)=>review.hospital?._id===id && review.author?.isDeleted!==true)
          setReviews(reviewsOfThisHospital)
          setServerLoading(false)
        } else {
          setServerLoading(false)
          await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
        }
      } catch {
        setServerLoading(false)
        await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    fetchData()
  }, [])

  return (
    <BackgroundTemplate>

      <AddButton
        text='口コミ投稿する'
        url={url}
        addButtonVisible={addButtonVisible} 
        setAddButtonVisible={setAddButtonVisible}
      />

      {hospital && reviews && (
        <>
          <ScrollView key={hospital._id} style={styles.scroll}>
            {/* ヘッダー */}
            <Text selectable={true} style={styles.title}>
              {hospital.hospitalname}
            </Text>
            <TouchableOpacity onPress={website}>
              <Text style={styles.websiteText}>
                公式HPをブラウザで開く
              </Text>
            </TouchableOpacity>
            <Text selectable={true} style={styles.location}>
              {hospital.location}
            </Text>

            {/* マップ */}
            <HospitalMap hospital={hospital}/>

            {/* 口コミ */}
            
            {reviews.length !== 0 ?(
              <ReviewsBox 
                reviews={reviews} 
                setHospital={setHospital} 
                jump 
              />
            ) : (
              <Text style={styles.nothing}>
                口コミはありません
              </Text>
            )}

            <View style={{padding: 64}} />
            
          </ScrollView>

          <BannerAds />
        </>
      )}
      
    </BackgroundTemplate>
  )    
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%'
  },
  title: {
    paddingTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 16
  },
  location: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 4
  },
  websiteText: {
    width: 200,
    marginHorizontal: 'auto',
    marginTop: 4,
    marginBottom: 4,
    paddingBottom: 4,
    backgroundColor: '#0000ff',
    color: 'white',
    borderRadius: 8,
    textAlign: 'center'
  },
  nothing: {
    marginVertical: 32,
    textAlign: 'center'
  }
})
