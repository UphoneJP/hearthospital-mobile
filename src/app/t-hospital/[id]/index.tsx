import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Linking, TouchableOpacity, View } from "react-native"
import { Text } from "react-native"

import { hospitalType } from "@/src/types/types"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import ReviewsBox from "@/src/components/review/ReviewsBox"
import AddButton from "@/src/components/parts/AddButton"
import HospitalMap from "@/src/components/review/HospitalMap"
import createAxiosClient from "@/utils/axiosClient"
import BannerAds from "@/src/components/template/BannerAds"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"

export default function HospitalDetail () {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [hospital, setHospital] = useState<hospitalType|undefined>(undefined)
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(true)
  const [reviewLength, setReviewLength] = useState<number|undefined>(undefined)
  const { setServerLoading } = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  const website = () => {
    Linking.openURL(hospital?.url || 'https://www.hearthospital.jp')
  }
  const url = `/t-hospital/${id}/new`

  useEffect(()=>{
    setReviewLength(hospital?.reviews?.filter(review=>review.ownerCheck===true&&review.author?.isDeleted===false).length) 
  }, [hospital])
  
  useEffect(()=>{
    async function getAxiosClient(){
      setServerLoading(true)
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get(`/api/hospital/${id}`)
        setHospital(response?.data.hospital)
      } catch {
        await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
      setServerLoading(false)
    }
    getAxiosClient()
  },[id])

  return (
    <BackgroundTemplate>

      <AddButton
        text='口コミ投稿する'
        url={url}
        addButtonVisible={addButtonVisible} 
        setAddButtonVisible={setAddButtonVisible}
      />

      {hospital && reviewLength !== undefined && (
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
            <Text selectable={true} style={styles.location}>{hospital.location}</Text>

            {/* マップ */}
            <HospitalMap hospital={hospital}/>

            {/* 口コミ */}
            
            {reviewLength !== 0 ?(
              <ReviewsBox 
                reviews={hospital.reviews} 
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
