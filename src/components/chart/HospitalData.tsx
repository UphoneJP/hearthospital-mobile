import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { Fragment, useState } from "react"
import { BarChart } from "react-native-gifted-charts"

import { type hospitalType, type KcodeType } from "../../types/types"
import CustomButton from "../parts/CustomButton"

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
          <Fragment key={area}>

            {/* エリアボタン */}
            <CustomButton
              title={area}
              color={expandedAreas[area] ? "#ff3c00" : "orange"}
              fun={() => {toggleArea(area)}}
            />

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
                  <Fragment key={hospital._id}>

                    {/* 病院ボタン */}
                    <CustomButton
                      title={hospital.hospitalname}
                      color="#ff6f00"
                      fun={()=>openHospitalData(hospital._id)}
                      style={{width: 248}}
                    />

                    {/* ダイアログボックス */}
                    {visibles[hospital._id] &&
                      <Modal
                        transparent
                        animationType="fade"
                        onRequestClose={() => closeHospitalData(hospital._id)}
                      >
                        <Pressable style={styles.mask} onPress={()=>closeHospitalData(hospital._id)}>
                          <View style={styles.container}>
                            <MaterialIcons
                              name="clear" 
                              size={24} 
                              color="#333333"
                              style={styles.clear} 
                              onPress={() => closeHospitalData(hospital._id)}  
                            />
                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                              {hospital.hospitalname}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                              &lt;&lt;診断群分類別患者数&gt;&gt;
                            </Text>

                            {/* DPCコードグラフ */}
                            <BarChart
                              // width={screenWidth - 60}
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
                              // width={screenWidth - 32}
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
                          </View>
                        </Pressable>
                      </Modal>
                    }

                  </Fragment>
                )
              }
              return null
            })}

          </Fragment>            
        )
      })}
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
    paddingBottom: 16,
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
  },
  chartSubTitle: {
    textAlign: 'center',
    color: 'green',
    marginTop: 16
  }
})
