/* eslint-disable no-unsafe-optional-chaining */
import { ActivityIndicator, Alert, Text, View } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useEffect, useState } from "react"
import createAxiosClient from "@/utils/axiosClient"
import { hospitalType } from "@/src/types/types"
import { saveToken } from "@/utils/secureStore"


interface PropsType {
  selectedHospitalname: string
  setSelectedHospitalname: React.Dispatch<React.SetStateAction<string>>
  hospitals: hospitalType[] | undefined
  setHospitals: React.Dispatch<React.SetStateAction<hospitalType[] | undefined>>
}
export default function SelectableHospital(prop: PropsType){
  const { 
    selectedHospitalname, 
    setSelectedHospitalname, 
    hospitals, 
    setHospitals
  } = prop
  const [areas, setAreas] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(()=>{
    async function getHospitals(){
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital')
        setHospitals(response?.data.hospitals)
        setAreas(response?.data.areas)
      } catch {
        Alert.alert('エラーで病院情報を取得できませんでした')
      }
    }
    getHospitals()
  }, [])

  useEffect(()=>{
    if(hospitals&&areas) {
      if(!selectedHospitalname)setSelectedHospitalname(areas[0])
      setLoading(false)
    }
  }, [hospitals, areas])

  if(loading){
    return (
      <ActivityIndicator color="orange" size="large" />
    )
  }

  return (
    <View style={{flexDirection:'row'}}>
      <Text style={{alignSelf: 'center'}}>病院選択: </Text>

      <Picker 
        selectedValue={selectedHospitalname}
        onValueChange={async(hospitalname) => {
          setSelectedHospitalname(hospitalname)
          await saveToken('reveiwNoID-hospital', hospitalname)
        }}
        style={{flex: 1, marginVertical: 8}}
      >
        {hospitals&&areas.flatMap(area => [
          <Picker.Item
            key={`area-${area}`}
            label={area}
            style={{color: 'white', backgroundColor: 'gray'}}
            enabled={false}
          />,
          ...hospitals?.filter(hospital => hospital.area === area).map(hospital => (
              <Picker.Item
                key={hospital._id}
                label={'　' + hospital.hospitalname}
                style={{color: 'green'}}
                value={hospital.hospitalname}
              />
            ))
        ])}
      </Picker>
    </View>
  )
}
