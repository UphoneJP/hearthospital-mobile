import { StyleSheet, Text, View } from 'react-native'
import BackgroundTemplate from '@/src/components/template/BackgroundTemplete'
import RewardedAds from '@/src/components/template/RewardedAds'
import BannerAds from '@/src/components/template/BannerAds'

export default function AdMobForData() {
  return (
    <BackgroundTemplate>
      <Text style={styles.headerTitle}>数字で見る病院データ</Text>

      <View style={styles.dialog}>
        <Text style={{color: 'gray'}}>
          HeartHospitalでは病院指標を基に独自フィルタリングし、令和3～5年度の各病院の手術情報を見やすく表やグラフにしました。『各病院でどんな手術を年間何件やっているか』が視覚で直感的にわかります。 広告視聴後にご覧ください。
        </Text>
        <Text style={{color: 'gray', fontSize: 10, marginTop: 8}}>
          ※ 病院指標とは、病院の診療実績や医療の質、安全性、効率性などを測るためのデータを集計・分析し、客観的に評価するための基準や指標です。日本では、各病院が国の指針に従って毎年公表しており、誰でも閲覧することができます。詳細については、各病院の公表資料をご確認ください。
        </Text>
      </View>

      <RewardedAds />
      
      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>
      
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    marginTop: 36,
    marginHorizontal: 'auto',
    fontSize: 24
  },
  dialog: {
    margin: 32,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
    padding: 16
  }
})

// // Expo Go用
// import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
// import { router } from "expo-router"
// import { StyleSheet, Text, TouchableOpacity } from "react-native"

// export default function AdMob () {
//     return (
//       <BackgroundTemplate>
//         <TouchableOpacity onPress={()=>{router.replace('/t-data/data')}}>
//           <Text style={styles.button}>ダミーページ（要修正）</Text>
//         </TouchableOpacity>
//       </BackgroundTemplate>
        
//     )
// }
// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: 'orange',
//     color: 'white',
//     paddingTop: 4,
//     paddingBottom: 8,
//     paddingHorizontal: 8,
//     borderRadius: 8,
//     fontSize: 16
//   }
// })
