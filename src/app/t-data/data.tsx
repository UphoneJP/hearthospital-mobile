import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native"

import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { type hospitalType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import Selector from "@/src/components/chart/Selector"
import DPCcodeSummary from "@/src/components/chart/DPCcodeSummary"
import KcodeSummary from "@/src/components/chart/KcodeSummary"
import HospitalData from "@/src/components/chart/HospitalData"
import NativeAds from "@/src/components/template/NativeAds"

export default function Data() {
  const [areas, setAreas] = useState<string[]>([])
  const [hospitals, setHospitals] = useState<hospitalType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedValue, setSelectedValue] = useState("R5")
  
  useEffect(()=>{
    axiosClient.get('/api/hospital')
    .then((response)=>{
      setAreas(response.data.areas)
      setHospitals(response.data.hospitals)
      setLoading(false)
    })
    .catch(()=>{
      Alert.alert('データを取得できませんでした。')
    })
  }, [])

  if(loading){
    return(
      <BackgroundTemplate>
        <ActivityIndicator size="large" color='orange'/>
        <Text>サーバーから読み込み中...</Text>
      </BackgroundTemplate>
    )
  }

  if(!loading){    
    return (
      <BackgroundTemplate>
        <ScrollView style={{width: '100%'}}>
          <Text style={styles.headerTitle}>数字で見る病院データ</Text>

          <Text style={styles.subTitle}>
            全病院における年度毎の患者数
          </Text>

          <Selector
            selectedValue={selectedValue} 
            setSelectedValue={setSelectedValue} 
          />

          <DPCcodeSummary
            hospitals={hospitals} 
            calcPatientsDPC={calcPatientsDPC}
            DPCcodeName={DPCcodeName}
            diseases={diseases}
            DPCs={DPCs}
            bgcolors={bgcolors}
            year={selectedValue}
          />

          <KcodeSummary
            hospitals={hospitals} 
            calcPatientsKcode={calcPatientsKcode}
            KcodeName={KcodeName}
            bgcolors={bgcolors}
            year={selectedValue}
          />

          <View style={{
            width: 300,
            borderWidth: 1,
            borderColor: '#bbbbbb',
            marginVertical: 24,
            margin: 'auto'
            }}
          />

          <Text style={styles.subTitle}>
            各病院における患者数の年推移
          </Text>

          <HospitalData 
            hospitals={hospitals} 
            areas={areas} 
            diseases={diseases}
            calcPatientsDPC={calcPatientsDPC}
            DPCs={DPCs}
            KcodeName={KcodeName}
            calcPatientsKcode={calcPatientsKcode}
            bgcolors={bgcolors}
          />

          <View style={styles.adBox}>
            <NativeAds />
          </View>

        </ScrollView>
      </BackgroundTemplate>
    )
  }
}

const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 36,
    marginBottom: 24,
    marginHorizontal: 'auto',
    fontSize: 24
  },
  subTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
    color: 'green'
  },
  adBox: {
    width: '80%',
    marginHorizontal: 'auto',
    marginTop: 8,
    marginBottom: 32
  }
})

function calcPatientsDPC(hospital:hospitalType, codes:string[], year:string) {
  let sum = 0
  const name = `${year}DPCcode`
  for(const code of codes){
      if(hospital[name]&&hospital[name][code]){
          sum += hospital[name][code][1]
      }
  }
  return sum
}

function calcPatientsKcode(hospital:hospitalType, code:string, year:string) {
  let sum = 0
  const name = `${year}Kcode`
  if (hospital[name] && hospital[name][code]) {
      sum += hospital[name][code][0]
  }
  return sum
}

const DPCcodeName = [
  // "大血管転位症手術 大血管血流転換術(ジャテーン手術)等",
  'x10100', 'x10101', 'x10110', 'x10111',
  // "ファロー四徴症手術等",
  'x0020', 'x0021', 'x1020',
  // "心室中隔欠損閉鎖術",
  'x0030', 'x1030', 'x1031',
  // "弁形成術等",
  'x1021', 'e14029xxx01x0xx',
  // "その他の手術"
  'x0970', 'e50210xx97000x'
]
const diseases = [ 
  ['x10100','x10101','x10110','x10111'], 
  ['x0020','x0021','x1020'],
  ['x0030','x1030','x1031'],
  ['x1021','e14029xxx01x0xx'],
  ['x0970','e50210xx97000x']
]
const DPCs = [
  "大血管転位症手術等",
  "ファロー四徴症手術等",
  "心室中隔欠損閉鎖術",
  "弁形成術等",
  "その他の手術"
]

const KcodeName = {
  'K5541': '弁形成術(１弁)',
  'K5551': '弁置換術(１弁)',
  'K5601ﾊ': '大動脈瘤切除術(上行)',
  'K563': '肺動脈絞扼術',
  'K566': '体動脈肺動脈短絡手術',
  'K5702': '純型肺動脈弁閉鎖症手術等',
  'K5741': '心房中隔欠損閉鎖術',
  'K5761': '心室中隔欠損閉鎖術',
  'K5801': 'ファロー四徴症手術',
  'K5812': 'ラステリ手術',
  'K5861': '両方向性グレン手術等',
  'K5862': 'フォンタン手術等',
  'K5972': 'ペースメーカー交換術',
  'K604-24': '植込型補助人工心臓',
  'K6171': '下肢静脈瘤手術'
}

const bgcolors = [
  'rgba(255, 99, 132, 0.8)',   // 赤
  'rgba(54, 162, 235, 0.8)',   // 青
  'rgba(255, 206, 86, 0.8)',   // 黄色
  'rgba(75, 192, 192, 0.8)',   // 水色
  'rgba(153, 102, 255, 0.8)',  // 紫
  'rgba(255, 159, 64, 0.8)',   // オレンジ
  'rgba(190, 190, 190, 0.8)',  // グレー
  'rgba(83, 102, 255, 0.8)',   // ディープブルー
  'rgba(120, 200, 246, 0.8)',  // ライトブルー
  'rgba(255, 193, 7, 0.8)',    // ゴールド
  'rgba(139, 195, 74, 0.8)',   // 緑
  'rgba(255, 87, 34, 0.8)',    // ディープオレンジ
  'rgba(158, 158, 158, 0.8)',  // ミディアムグレー
  'rgba(233, 30, 99, 0.8)',    // ピンク
  'rgba(121, 85, 72, 0.8)',    // ブラウン
  'rgba(96, 125, 139, 0.8)',   // ブルーグレー
  'rgba(244, 67, 54, 0.8)',    // レッド
  'rgba(0, 150, 136, 0.8)',    // ティール
  'rgba(103, 58, 183, 0.8)',   // ディープパープル
  'rgba(33, 150, 243, 0.8)',   // ライトブルー
  'rgba(156, 39, 176, 0.8)',   // 紫（ダーク）
  'rgba(0, 188, 212, 0.8)',    // シアン
  'rgba(190, 210, 57, 0.8)',   // ライム
  'rgba(3, 169, 244, 0.8)',    // ライトスカイブルー
  'rgba(255, 235, 59, 0.8)',   // イエロー
  'rgba(170, 170, 170, 0.8)',  // グレイッシュホワイト
  'rgba(255, 140, 0, 0.8)',    // ダークオレンジ
  'rgba(220, 0, 78, 0.8)',     // ディープピンク
  'rgba(76, 175, 80, 0.8)',    // グリーン
  'rgba(124, 179, 66, 0.8)'    // ライトグリーン
]
