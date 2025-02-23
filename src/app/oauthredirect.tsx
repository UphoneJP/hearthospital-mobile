/* eslint-disable @typescript-eslint/no-require-imports */
import { ActivityIndicator, Image, View } from "react-native"
import BackgroundTemplate from "../components/template/BackgroundTemplete"
import { Text } from "react-native"

export default function oauthredirect(){
  return (
    <BackgroundTemplate>
      <Image 
        source={require('../../assets/hearton.png')}
        style={{width:240, height:240}}  
      />
      <View style={{flexDirection: 'row', margin: 96, gap: 24}}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold'          
        }}>ログイン中...</Text>
        <ActivityIndicator size={"large"} color="orange" />
      </View>  
      
    </BackgroundTemplate>
  )
}
