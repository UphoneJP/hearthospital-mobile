import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"

import { type hospitalType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import CustomButton from "@/src/components/parts/CustomButton"
import { LoadingContext } from "@/src/context/loadingContext"

import { AuthContext } from "@/src/context/loginContext"

export default function Area () {
  const [areas, setAreas] = useState<string[]>([])
  const [hospitals, setHospitals] = useState<hospitalType[]>([])
  const {setServerLoading} = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)

  useEffect(()=>{
    async function getAxiosClient(){
      try {
        setServerLoading(true)
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital')
        setAreas(response?.data.areas)
        setHospitals(response?.data.hospitals)
        setServerLoading(false)
      } catch {
        await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    getAxiosClient()
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
