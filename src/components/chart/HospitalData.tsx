import { Button, Dialog } from "@rneui/themed"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AntDesign } from '@expo/vector-icons'
import { useState } from "react"
import { BarChart } from "react-native-gifted-charts"

import { type hospitalType, type KcodeType } from "../../types/types"

interface PropsType {
  hospitals: hospitalType[]
  areas: string[]
  diseases: string[][]
  DPCs: string[]
  calcPatientsDPC: (hospital: hospitalType, codes: string[], year: string) => number
  KcodeName: KcodeType
  calcPatientsKcode: (hospital: hospitalType, code: string, year: string)=> number
  bgcolors: string[]
}

export default function HospitalData( prop: PropsType) {
  const { hospitals, areas, diseases, DPCs, calcPatientsDPC, bgcolors, KcodeName, calcPatientsKcode } = prop
  const [visibles, setVisibles] = useState<{ [key: string]: boolean }>({})
  const [expandedAreas, setExpandedAreas] = useState<{ [key: string]: boolean }>({
    '北海道・東北地方': false,
    '関東地方': false,
    '中部地方': false,
    '近畿地方': false,
    '中国・四国地方': false,
    '九州・沖縄地方': false
  })

  function toggleArea (area: string) {
    setExpandedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }))
  }
  function openHospitalData (hospital: string) {
    setVisibles(prev => ({
      ...prev,
      [hospital]: true
    }))
  }
  function closeHospitalData (hospital: string) {
    setVisibles(prev => ({
      ...prev,
      [hospital]: false
    }))
  }

  return (
    <>
      {areas.map(area=>{
        return (
          <View key={area}>

            {/* エリアボタン */}
            <Button
              title={
                <View style={{flexDirection:'row'}}>
                  <Text style={{color:'white'}}>{area}  </Text>
                  {expandedAreas[area]?(
                    <AntDesign name="caretup" size={16} color="white" style={{marginTop: 4}} />
                  ) : (
                    <AntDesign name="caretdown" size={16} color="white" />
                  )}
                </View>
              }
              onPress={() => {toggleArea(area)}}
              buttonStyle={styles.button}
              color={expandedAreas[area]?'#fede9d':'orange'}
            />

            <View style={{marginBottom: 8}}>
              {expandedAreas[area]&&hospitals.map(hospital=>{
                const years = ['R3', 'R4', 'R5']

                const DPCstackDatas: {stacks:{value:number, color:string}[], label:string}[] = []
                years.map(year=>{
                  const stacks: {value: number, color: string}[] = []
                  diseases.forEach((disease, index)=> {
                    const value = calcPatientsDPC(hospital, disease, year)
                    stacks.push({value: value, color: bgcolors[index]})
                  })
                  DPCstackDatas.push({stacks: stacks, label: year})
                })

                const KcodeStackDatas: {stacks:{value:number, color:string}[], label:string}[] = []
                years.map(year=>{
                  const stacks: {value: number, color: string}[] = []
                  const Kcodes = Object.keys(KcodeName)
                  Kcodes.forEach((Kcode, index)=> {
                    const value = calcPatientsKcode(hospital, Kcode, year)
                    stacks.push({value: value, color: bgcolors[index]})
                  })
                  KcodeStackDatas.push({stacks: stacks, label: year})
                })
                  
                if(
                  hospital.area===area && 
                  (hospital.R3Kcode||hospital.R3DPCcode||hospital.R4Kcode||hospital.R4DPCcode||hospital.R5Kcode||hospital.R5DPCcode)
                ){
                  return (
                    <View key={hospital._id}>

                      {/* 病院ボタン */}
                      <TouchableOpacity
                        style={{}}
                        onPress={()=>{openHospitalData(hospital._id)}}
                      >
                        <Text style={{textAlign:'center', marginVertical: 8}}>
                          {hospital.hospitalname}
                        </Text>
                      </TouchableOpacity>

                      {/* ダイアログボックス */}
                      <Dialog
                        isVisible={visibles[hospital._id]||false}
                        onBackdropPress={()=>{closeHospitalData(hospital._id)}}
                        overlayStyle={styles.dialogBox}
                      >
                        <Text style={styles.chartTitle}>{hospital.hospitalname}</Text>
                        {/* クローズボタン */}
                        <TouchableOpacity 
                          style={styles.closeButton}
                          onPress={() => {closeHospitalData(hospital._id)}}
                        >
                          <AntDesign name="close" size={24} color="gray" />
                        </TouchableOpacity>

                        {/* ダイアログボックスタイトル1 */}
                        <Text style={styles.chartSubTitle}>
                          &lt;&lt;診断群分類別患者数&gt;&gt;
                        </Text>

                        {/* DPCコードグラフ */}
                        <BarChart
                          width={screenWidth - 32}
                          height={screenHeight / 2}
                          barWidth={40}
                          initialSpacing={(screenWidth-180)/8}
                          spacing={(screenWidth-180)/4}
                          noOfSections={4}
                          autoCenterTooltip={true}
                          leftShiftForLastIndexTooltip={80}
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
                          stackData={DPCstackDatas}
                        />


                        {/* ダイアログボックスタイトル2 */}
                        <Text style={styles.chartSubTitle}>
                          &lt;&lt;主要手術別患者数&gt;&gt;
                        </Text>

                        {/* Kcodeグラフ */}
                        <BarChart 
                          width={screenWidth - 32}
                          height={screenHeight / 2}
                          barWidth={40}
                          initialSpacing={(screenWidth-180)/8}
                          spacing={(screenWidth-180)/4}
                          noOfSections={4}
                          autoCenterTooltip={true}
                          leftShiftForLastIndexTooltip={80}
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
                          stackData={KcodeStackDatas}
                        />

                      </Dialog>
                    </View>
                  )
                }
                return null
              })}
            </View>

          </View>            
        )
      })}
    </>
  )
}
const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height - 280
const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    width: 220,
    margin: 'auto'
  },
  dialogBox: {
    width: screenWidth - 32,
    paddingHorizontal: 0
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8
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
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  chartSubTitle: {
    textAlign: 'center',
    color: 'green',
    marginTop: 16
  }
})
