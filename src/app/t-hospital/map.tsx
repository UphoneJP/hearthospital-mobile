import { Alert, StyleSheet, ActivityIndicator } from "react-native"
import { useState, useEffect } from "react"
import { type hospitalType } from "@/src/types/types"
import MapView, { Marker } from 'react-native-maps'
import axiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
//http://IPアドレス:3000/api

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

  return (
    <BackgroundTemplate>            
      {loading? (
        <ActivityIndicator size="large" color="#ff9500" />
      ) : (
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
      )}
    </BackgroundTemplate>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%'
  }
})
