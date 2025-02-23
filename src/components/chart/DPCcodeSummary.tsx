import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { BarChart } from "react-native-gifted-charts"
import { type hospitalType } from "../../types/types"
import { useState } from "react"
import { Button, Dialog } from "@rneui/themed"
import { AntDesign } from "@expo/vector-icons"

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
    <View>
      <Button
        title="診断群分類別患者数 まとめ"
        onPress={() => {setVisible(!visible)}}
        buttonStyle={styles.button}
        color='orange'
      />
      <Dialog
        isVisible={visible}
        onBackdropPress={() => {setVisible(!visible)}}
        overlayStyle={styles.dialogBox}
      >
        <Dialog.Title 
          title="診断群分類別患者数 まとめ" 
          titleStyle={{textAlign:'center'}}
        />

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => {setVisible(!visible)}}
        >
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
        
        <BarChart
          xAxisLabelTextStyle={{fontSize: 8}}
          labelWidth={160}
          xAxisLabelsHeight={64}
          width={screenWidth}
          height={screenHeight}
          rotateLabel
          barWidth={60}
          initialSpacing={16}
          spacing={32}
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
      </Dialog>
      
    </View>
  )
}

const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height - 400



const styles = StyleSheet.create({
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
  },
  button: {
    borderRadius: 6,
    width: 220,
    margin: 'auto'
  },
  dialogBox: {
    width: screenWidth,
    paddingHorizontal: 0
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8
  }
})
