import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"

import { type hospitalType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import CustomButton from "@/src/components/parts/CustomButton"

export default function Area () {
  const [areas, setAreas] = useState<string[]>([])
  const [hospitals, setHospitals] = useState<hospitalType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    async function getAxiosClient(){
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital')
        setAreas(response?.data.areas)
        setHospitals(response?.data.hospitals)
        setLoading(false)
      } catch {
        Alert.alert("病院情報の取得に失敗しました。")
      }
    }
    getAxiosClient()
  }, [])

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
