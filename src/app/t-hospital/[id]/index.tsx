import { useSearchParams } from "expo-router/build/hooks"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, ActivityIndicator, Linking, TouchableOpacity  } from "react-native"
import { Text, Alert } from "react-native"

import { hospitalType } from "@/src/types/types"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import ReviewsBox from "@/src/components/review/ReviewsBox"
import AddButton from "@/src/components/parts/AddButton"
import HospitalMap from "@/src/components/review/HospitalMap"
import axiosClient from "@/utils/axiosClient"
//http://IPアドレス:3000/api

export default function HospitalDetail () {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [hospital, setHospital] = useState<hospitalType|undefined>(undefined)
  const [addButtonVisible, setAddButtonVisible] = useState<boolean>(true)
  const [reviewLength, setReviewLength] = useState<number|undefined>(undefined)
  const website = () => {
    Linking.openURL(hospital?.url || 'https://www.hearthospital.jp')
  }
  const url = `/t-hospital/${id}/new`

  useEffect(()=>{
    setReviewLength(hospital?.reviews?.filter(review=>review.ownerCheck===true&&review.author?.isDeleted===false).length) 
  }, [hospital])
  
  useEffect(()=>{
    axiosClient.get(`/api/hospital/${id}`)
    .then(response => {
      setHospital(response.data.hospital)
    })
    .catch(() => {
      Alert.alert("病院情報の取得に失敗しました。")
    })
  },[id])

  if(!hospital || reviewLength === undefined) {
    return (
      <BackgroundTemplate>
        <ActivityIndicator size="large" color="#ff9500" />
      </BackgroundTemplate>
    )
  }

  return (
    <BackgroundTemplate>

      <AddButton
        text='口コミ投稿する'
        url={url}
        addButtonVisible={addButtonVisible} 
        setAddButtonVisible={setAddButtonVisible}
      />
      
      <ScrollView key={hospital._id} style={styles.scroll}>
        {/* ヘッダー */}
        <Text style={styles.title}>{hospital.hospitalname}</Text>
        <TouchableOpacity onPress={website}>
          <Text style={styles.websiteText}>
            公式HPをブラウザで開く
          </Text>
        </TouchableOpacity>
        <Text style={styles.location}>{hospital.location}</Text>

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
      </ScrollView>
      
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
    fontSize: 20
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
