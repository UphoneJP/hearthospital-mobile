import { ActivityIndicator, StyleSheet, Text } from "react-native"
import { useState, useEffect, useContext } from "react"
import MapView, { Marker } from 'react-native-maps'
import { router } from "expo-router"

import { type hospitalType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import BannerAds from "@/src/components/template/BannerAds"
import { AuthContext } from "@/src/context/loginContext"

export default function Map () {
  const [hospitals, setHospitals] = useState<hospitalType[]|undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)

  const {backToHome} = useContext(AuthContext)

  useEffect(()=>{
    async function getAxiosClient(){
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital')
        setHospitals(response?.data.hospitals)
        setLoading(false)
      } catch {
        await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    getAxiosClient()
  },[])

  if(loading){
    return(
      <BackgroundTemplate>
        <ActivityIndicator size="large" color="orange"/>
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
          if (
            typeof hospital.lat !== 'number' || 
            typeof hospital.lng !== 'number'
          ) return null

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
