import { ScrollView, View } from "react-native"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import BannerAds from "@/src/components/template/BannerAds"
import PointsHeader from "@/src/components/points/PointsHeader"
import PointsGet from "@/src/components/points/PointsGet"
import PointsUse from "@/src/components/points/PointsUse"

export default function Points() {

  return (
      <BackgroundTemplate>
        <ScrollView style={{width: '100%'}}>

          <PointsHeader />
          
          <PointsGet />

          <PointsUse />

          <View style={{padding: 64}}/>
        </ScrollView>

        <View style={{position: 'absolute', bottom: 0}}>
          <BannerAds />
        </View>

      </BackgroundTemplate>
  )
}
