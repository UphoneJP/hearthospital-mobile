import { StyleSheet } from "react-native"
import { useState, useEffect, useContext } from "react"
import MapView, { Marker } from 'react-native-maps'
import { router } from "expo-router"

import { type hospitalType } from "@/src/types/types"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import BannerAds from "@/src/components/template/BannerAds"
import { AuthContext } from "@/src/context/loginContext"
import { LoadingContext } from "@/src/context/loadingContext"
import { getData } from "@/utils/asyncStorage"

export default function Map () {
  const [hospitals, setHospitals] = useState<hospitalType[]|undefined>(undefined)
  const {setServerLoading, setLoadingPercentage} = useContext(LoadingContext)

  const {backToHome} = useContext(AuthContext)

  useEffect(()=>{
    async function fetchHospitals(){
      try {
        setServerLoading(true)
        setLoadingPercentage(0)
        const loadHospitals = await getData('hospitals')
        if(loadHospitals){
          setHospitals(JSON.parse(loadHospitals))
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
    fetchHospitals()
  }, [])

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
