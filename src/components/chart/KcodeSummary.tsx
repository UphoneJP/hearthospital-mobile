import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { BarChart } from "react-native-gifted-charts"
import { type hospitalType } from "../../types/types"
import { useState } from "react"
import { Button, Dialog } from "@rneui/themed"
import { AntDesign } from "@expo/vector-icons"

type KcodeType = {
  K5541: string,
  K5551: string,
  K5601ﾊ: string,
  K563: string,
  K566: string,
  K5702: string,
  K5741: string,
  K5761: string,
  K5801: string,
  K5812: string,
  K5861: string,
  K5862: string,
  K5972: string,
  'K604-24': string,
  K6171: string
}
interface PropsType {
  hospitals: hospitalType[]
  calcPatientsKcode: (hospital: hospitalType, code: string, year: string)=> number
  KcodeName: KcodeType
  bgcolors: string[]
  year: string
}

export default function KcodeSummary(prop:PropsType){

  const {hospitals, calcPatientsKcode, KcodeName, bgcolors, year} = prop
  const [visible, setVisible] = useState(false)
  
  function sortHospitalKcode(
    hospitals:hospitalType[], 
    codes: KcodeType, 
    year:string
  ) {
    let arrays = []
    const name = `${year}Kcode`
    for(const hospital of hospitals){
        let sum = 0
        for(const code of Object.keys(codes)){
            if(hospital[name]&&hospital[name][code]){
                sum += hospital[name][code][0]
            }
        }
        if(sum>0){arrays.push({hospital,sum})}
    }
    arrays = arrays.sort((a, b) => b.sum - a.sum)
    return arrays
  }

  const stackData:{stacks:{value:number, color:string}[], label:string}[] = []
  const sortedHospitals = sortHospitalKcode(hospitals, KcodeName, year)
  sortedHospitals.map(hospital=>{
    const stacks: {value: number, color: string}[] = []
    const Kcodes = Object.keys(KcodeName)
    Kcodes.forEach((Kcode, index)=> {
      const value = calcPatientsKcode(hospital.hospital, Kcode, year)
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
        title="主要手術別患者数 まとめ"
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
          title="主要手術別患者数 まとめ" 
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
                      <Text>{`${Object.values(KcodeName)[index]}: ${stack.value}`}件</Text>
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
    margin: 'auto',
    marginTop: 16
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
