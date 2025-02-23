import { Alert, StyleSheet, View } from "react-native"
import RaisedButton from "../parts/RaisedButton"
import { router } from "expo-router"
import { useContext } from "react"
import { AuthContext } from "../../context/loginContext"
import axiosClient from "@/utils/axiosClient"

export default function LogoutBox ( ){
  const {logout, user} = useContext(AuthContext)

  async function deleteFun() {
    const response = await axiosClient.delete(`/api/user/${user?._id}`)
    if(response.data.delete){
      logout()
      .then(()=>{
        Alert.alert('アカウントを削除しました。')
      })
      router.replace('/user/login')
    }
  }

  return (
    <View style={styles.logoutBox}>
      <RaisedButton 
        title='ログアウト' 
        color='orange'
        fun={()=>{
          logout()
          router.replace('/user/login')
        }}
        styleChange={styles.RaisedButton}
      />
      <RaisedButton 
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
        styleChange={styles.RaisedButton}
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
