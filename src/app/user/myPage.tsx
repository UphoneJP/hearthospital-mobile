import { useContext } from "react"
import { Text, View, StyleSheet, ScrollView } from "react-native"

import { AuthContext } from "@/src/context/loginContext"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import PenName from "@/src/components/user/PenName"
import Promotion from "@/src/components/user/Promotion"
import MyPageBox from "@/src/components/user/MyPageBox"
import LogoutBox from "@/src/components/user/LogoutBox"
import Password from "@/src/components/user/Password"
import Notify from "@/src/components/user/Notify"

export default function MyPage () {
  const {isLoggedIn, user} = useContext(AuthContext)
  
  return (
    <BackgroundTemplate>
      <ScrollView style={{width: '90%', margin:'auto'}}>
        <Text style={styles.title}>マイページ</Text>

        {isLoggedIn?(
          <>
            <MyPageBox 
              title='非公開情報' icon='visibility-off'
            >
              <>
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:'bold'}}>会員ID: </Text>
                  <Text style={{flex:1}}> {user?._id}</Text>
                </View>

                {user?.username&&
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontWeight:'bold'}}>お名前: </Text>
                    <Text style={{flex:1}}> {user?.username}</Text>
                  </View>
                }
                
                <View style={{flexDirection:'row'}}>
                  <Text style={{fontWeight:'bold'}}>Email: </Text>
                  <Text style={{flex:1}}> {user?.email}</Text>
                </View>
              
                <Password />
                <Notify />
              
              </>
            </MyPageBox>
            
            <MyPageBox 
              title='公開情報' icon='visibility'
            >
              <>
                <PenName />
                <Promotion />
              </>
            </MyPageBox>

            
            <LogoutBox />
          </>
        ):(
          <Text>アカウント情報がありません</Text>
        )}
      </ScrollView>
    </BackgroundTemplate>
  )
}

const styles = StyleSheet.create({
  title: {
    marginHorizontal:'auto',
    marginVertical: 16, 
    fontSize: 24
  }
})
