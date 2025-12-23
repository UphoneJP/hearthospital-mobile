/* eslint-disable no-unsafe-optional-chaining */
import { ActivityIndicator, Text, View } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useContext, useEffect, useState } from "react"
import { hospitalType } from "@/src/types/types"
import { AuthContext } from "@/src/context/loginContext"
import areas from "@/utils/areas"
import { LoadingContext } from "@/src/context/loadingContext"
import { getData, saveData } from "@/utils/asyncStorage"


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
  const [loading, setLoading] = useState<boolean>(true)
  const {backToHome} = useContext(AuthContext)
  const {setServerLoading, setLoadingPercentage} = useContext(LoadingContext)

  useEffect(()=>{
    async function fetchHospitals(){
      try {
        setServerLoading(true)
        setLoadingPercentage(0)
        const loadHospitals = await getData('hospitals')
        if(loadHospitals){
          setHospitals(JSON.parse(loadHospitals))
        } else {
          await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
        }
        setServerLoading(false)
      } catch {
        setServerLoading(false)
        await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    fetchHospitals()
  }, [])

  useEffect(()=>{
    if(hospitals) {
      if(!selectedHospitalname)setSelectedHospitalname(areas[0])
      setLoading(false)
    }
  }, [hospitals])

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
          await saveData('reveiwNoID-hospital', hospitalname)
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
