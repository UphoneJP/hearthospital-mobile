import { StyleSheet, Text, View } from "react-native"

import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import CustomButton from "@/src/components/parts/CustomButton"
import BannerAds from "@/src/components/template/BannerAds"

export default function Hospital () {
    return (
        <BackgroundTemplate>
            <Text style={styles.title}>病院・口コミ検索</Text>
            <CustomButton title='地図から病院を探す' color='#037405' url='/t-hospital/map' />
            <CustomButton title='地域名から病院を探す' color='#373ef7' url='/t-hospital/area' />
            <CustomButton title='病名から口コミを探す' color='#f71a34' url='/t-hospital/diseaseName' />
            
            <View style={{position: 'absolute', bottom: 0}}>
              <BannerAds />
            </View>
            
        </BackgroundTemplate>
    )
}
const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    fontSize: 24
  }
})
