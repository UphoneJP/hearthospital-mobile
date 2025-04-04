import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AuthContext } from "../../context/loginContext"
import createAxiosClient from "@/utils/axiosClient"

export default function Promotion () {
  const { user, setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState<boolean>(false)
  const [promotionEdit, setPromotionEdit] = useState<boolean>(false)
  const [promotionInput, setPromotionInput] = useState<string|undefined>(user?.promotion)

  useEffect(()=>{
    setPromotionInput(user?.promotion)
  }, [user])

  async function changePromotion () {
    setLoading(true)
    setPromotionEdit(false)
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.patch(`/api/user/promotion/${user?._id}`, {promotionInput})
      setUser(response?.data.user)
      Alert.alert('自己紹介文を変更しました。')
      setLoading(false)
    } catch {
      Alert.alert('エラーが発生しました。')
      setLoading(false)
    }
  }

  return (
    <>
      {promotionEdit?(
        <View style={styles.promotionBoxEditting}>
          <Text style={{marginVertical: 'auto'}}>自己紹介文: </Text>
          <TextInput 
            autoFocus
            multiline={true}
            autoCapitalize='none'
            value={promotionInput}
            placeholder="自己紹介文を入力してください"
            onChangeText={(text)=>setPromotionInput(text)}
            style={styles.editInput}
          />
          <TouchableOpacity 
            style={styles.editButtonEditting}
            onPress={changePromotion}  
          >
            <Text>変更</Text>
          </TouchableOpacity>
        </View>
      ):(
        <View style={styles.promotionBox}>
          <Text style={{fontWeight:'bold'}}>自己紹介文: </Text>
          <Text style={{flex:1, paddingBottom: 16}}> {user?.promotion}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={()=>setPromotionEdit(true)}  
          >
            {loading?(
              <ActivityIndicator size='small' color='white' />
            ):(
              <Text>編集</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  promotionBox: {
    flexDirection: 'row'
  },
  promotionBoxEditting: {
    height: 120,
    paddingHorizontal: 32
  },
  editButtonEditting: {
    backgroundColor: 'skyblue',
    paddingHorizontal: 8,
    paddingBottom: 4,
    paddingTop: 2,
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButton: {
    backgroundColor: 'skyblue',
    paddingHorizontal: 8,
    paddingBottom: 4,
    paddingTop: 2,
    borderRadius: 8,
    marginLeft: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editInput: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 8
  }  
})
