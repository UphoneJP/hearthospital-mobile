import { Alert, StyleSheet, ActivityIndicator, Text } from "react-native"
import { useState, useEffect } from "react"
import MapView, { Marker } from 'react-native-maps'
import { router } from "expo-router"

import { type hospitalType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import BannerAds from "@/src/components/template/BannerAds"

export default function Map () {
  const [hospitals, setHospitals] = useState<hospitalType[]|undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    axiosClient.get(`/api/hospital`)
    .then(response => {
      setHospitals(response.data.hospitals)
      setLoading(false)
    })
    .catch(() => {
      Alert.alert("病院情報の取得に失敗しました。")
    })
  },[])

  if(loading){
    return (
      <BackgroundTemplate>
        <ActivityIndicator size="large" color="orange" />
        <Text>サーバーから読み込み中...</Text>
      </BackgroundTemplate>
    )
  }

  return (
    <BackgroundTemplate>            
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 36,
          longitude: 135,
          latitudeDelta: 15,
          longitudeDelta: 15
        }}
      >
        {hospitals?.map(hospital => {
          return (
            <Marker
              key={hospital._id}
              coordinate={{ 
                latitude: hospital.lat, 
                longitude: hospital.lng
              }}
              title={hospital.hospitalname}
              description={`口コミ${hospital.reviews?.filter(review=>review.ownerCheck&&!review.author?.isDeleted).length}件`}
              onCalloutPress={() => router.push(`/t-hospital/${hospital._id}`)}
            />
          )
        })}
      </MapView>
      <BannerAds />
    </BackgroundTemplate>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%'
  }
})
