import { Alert, StyleSheet, View } from "react-native"
import { router } from "expo-router"
import { useContext } from "react"
import { AuthContext } from "../../context/loginContext"
import createAxiosClient from "@/utils/axiosClient"
import CustomButton from "../parts/CustomButton"

export default function LogoutBox ( ){
  const {logout, user} = useContext(AuthContext)

  async function deleteFun() {
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.delete(`/api/user/${user?._id}`)
      if(response?.data.delete){
        logout()
        .then(()=>{
          Alert.alert('アカウントを削除しました。')
        })
        router.replace('/user/login')
      }
    } catch {
      Alert.alert('エラーが発生しました。')
    }
  }

  return (
    <View style={styles.logoutBox}>
      <CustomButton 
        title='ログアウト' 
        color='gray'
        fun={()=>{
          logout()
          router.replace('/user/login')
        }}
        style={{width: '50vw', paddingVertical: 4}}
      />
      <CustomButton 
        title='アカウント削除' 
        color='red'
        fun={()=>{
          Alert.alert(
            '今までに投稿されたデータも全て削除します。',
            'アカウントを本当に削除してもよろしいですか？', 
            [
              {text: 'キャンセル', style: 'cancel'},
              {text: '削除する', onPress: deleteFun}
            ]
          )
        }}
        style={{width: '50vw', paddingVertical: 4}}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  logoutBox: {
    flexDirection: 'row', 
    gap: 8, 
    paddingHorizontal: 16
  },
  RaisedButton: {
    flex: 1,
    marginHorizontal: 'auto',
    marginVertical: 10
  }
})
