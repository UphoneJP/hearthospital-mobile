import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { BarChart } from "react-native-gifted-charts"
import { type hospitalType } from "../../types/types"
import { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import CustomButton from "../parts/CustomButton"

interface PropsType {
  hospitals: hospitalType[]
  calcPatientsDPC: (hospital: hospitalType, codes: string[], year: string) => number
  DPCcodeName: string[]
  DPCs: string[]
  diseases: string[][]
  bgcolors: string[]
  year: string
}

export default function DPCcodeSummary(prop:PropsType){

  const {hospitals, calcPatientsDPC, DPCcodeName, diseases, DPCs, bgcolors, year} = prop
  const [visible, setVisible] = useState(false)
  
  function sortHospitalDPC(
    hospitals:hospitalType[], 
    codes:string[], 
    year:string
  ) {
    let arrays = []
    const name = `${year}DPCcode`
    for(const hospital of hospitals){
        let sum = 0
        for(const code of codes){
            if(hospital[name]&&hospital[name][code]){
                sum += hospital[name][code][1]
            }
        }
        if(sum>0){arrays.push({hospital,sum})}
    }
    arrays = arrays.sort((a, b)=> b.sum - a.sum)
    return arrays
  }

  const stackData:{stacks:{value:number, color:string}[], label:string}[] = []
  const sortedHospitals = sortHospitalDPC(hospitals, DPCcodeName, year)
  sortedHospitals.map(hospital=>{
    const stacks: {value: number, color: string}[] = []
    diseases.forEach((disease, index)=> {
      const value = calcPatientsDPC(hospital.hospital, disease, year)
      stacks.push({value: value, color: bgcolors[index]})
    })
    stackData.push({
      stacks: stacks,
      label: hospital.hospital.hospitalname        
    })
  })

  return (
    <>
      <CustomButton
        title="診断群分類別患者数 まとめ"
        color='orange'
        fun={()=>setVisible(true)}
      />

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.mask} onPress={()=>setVisible(false)}>
          <View style={styles.container}>
            <MaterialIcons 
              name="clear" 
              size={24} 
              color="#333333"
              style={styles.clear} 
              onPress={()=>setVisible(false)}  
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
              令和{year==='R6' ? 6 : year==='R5' ? 5 : year==='R4' ? 4 : year==='R3' ? 3 : '?'}年度
            </Text>
            <Text style={{ fontSize: 16 }}>診断群分類別患者数 まとめ</Text>

            <BarChart
              xAxisLabelTextStyle={{fontSize: 10}}
              labelWidth={120}
              xAxisLabelsHeight={64}
              width={screenWidth}
              height={screenHeight}
              rotateLabel
              barWidth={54}
              initialSpacing={16}
              spacing={8}
              endSpacing={32}
              noOfSections={4}
              autoCenterTooltip={true}
              leftShiftForTooltip={0}
              leftShiftForLastIndexTooltip={160}
              renderTooltip={(e)=>{
                return (
                  <View style={styles.tipsBox}>
                    <Text style={{fontWeight: 'bold'}}>{e.label}</Text>
                    {e.stacks.map((stack:{value: number, color: string}, index: number) => (
                      stack.value > 0 && (
                        <View 
                          key={index} 
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              backgroundColor: stack.color,
                              borderRadius: 6,
                              marginTop: 2
                            }}
                          />
                          <Text>{`${DPCs[index]}: ${stack.value}`}件</Text>
                        </View>
                      )
                    ))}
                  </View>
                )
              }}
              stackData={stackData}
            />
          </View>
        </Pressable>
      </Modal>

    </>
  )
}

const screenWidth = Dimensions.get("window").width - 60
const screenHeight = Dimensions.get("window").height * 0.6

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingTop: 40,
    borderColor: 'orange',
    borderWidth: 1
  },
  clear: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 50,
    padding: 8
  },
  tipsBox: {
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 4,
    zIndex: 100,
    position: "absolute",
    top: -20,
    left: -40,
    backgroundColor: "white"
  }
})
