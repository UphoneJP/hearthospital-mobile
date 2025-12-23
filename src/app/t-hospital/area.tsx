import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"

import { type hospitalType } from "@/src/types/types"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import CustomButton from "@/src/components/parts/CustomButton"
import { LoadingContext } from "@/src/context/loadingContext"

import { AuthContext } from "@/src/context/loginContext"
import areas from "@/utils/areas"
import { getData } from "@/utils/asyncStorage"

export default function Area () {
  const [hospitals, setHospitals] = useState<hospitalType[]>([])
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
      <ScrollView key="scrollview" style={styles.scroll}>
        {areas.map(area=>{
          return (
            <View key={area} style={styles.areaBox}>
              <CustomButton 
                title={area} 
                color='#abcdef'
                disabledFun={true}
              />
              {hospitals.map(hospital=>{
                if(hospital.area===area){
                  return (
                    <TouchableOpacity
                      key={hospital._id}
                      style={styles.hospital}
                      onPress={()=>
                        router.push(`/t-hospital/${hospital._id}`)}  
                    >
                      <Text style={styles.text}>
                        {hospital.hospitalname}
                      </Text>
                    </TouchableOpacity>
                  )
                }
                return null
              })}
            </View>            
          )
        })}
      </ScrollView>
    </BackgroundTemplate>
  )
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%'
  },
  areaBox: {
    paddingBottom: 32
  },
  hospital: {
    padding: 4
  },
  text: {
    textAlign: 'center'
  }
})
