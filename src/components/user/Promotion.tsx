import { useContext, useEffect, useState } from "react"
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AuthContext } from "../../context/loginContext"
import createAxiosClient from "@/utils/axiosClient"
import { LoadingContext } from "@/src/context/loadingContext"

export default function Promotion () {
  const { user, setUser } = useContext(AuthContext)
  const [promotionEdit, setPromotionEdit] = useState<boolean>(false)
  const [promotionInput, setPromotionInput] = useState<string|undefined>(user?.promotion)
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)


  useEffect(()=>{
    setPromotionInput(user?.promotion)
  }, [user])

  async function changePromotion () {
    Keyboard.dismiss()
    setServerLoading(true)
    setLoadingPercentage(0)
    setPromotionEdit(false)
    if (!promotionInput || promotionInput.length < 1) {
      Alert.alert('自己紹介文を入力してください。')
      setServerLoading(false)
      return
    }
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.patch(`/api/user/promotion/${user?._id}`, {promotionInput})
      setUser(response?.data.user)
      Alert.alert('自己紹介文を変更しました。')
      setServerLoading(false)
    } catch {
      Alert.alert('エラーが発生しました。')
      setServerLoading(false)
    }
  }

  return (
    <>
      {promotionEdit?(
        <>
          <View style={styles.promotionBox}>
            <Text style={{marginVertical: 'auto'}}>自己紹介文: </Text>
            <TouchableOpacity 
              style={[styles.editButtonEditting, {backgroundColor: 'orange'}]}
              onPress={changePromotion}  
            >
              <Text style={{color: 'white'}}>変更する</Text>
            </TouchableOpacity>
          </View>
          <TextInput 
            autoFocus
            multiline={true}
            autoCapitalize='none'
            value={promotionInput}
            placeholder="自己紹介文を入力してください"
            onChangeText={(text)=>setPromotionInput(text)}
            style={styles.editInput}
          />
        </>
      ):(
        <>
          <View style={styles.promotionBox}>
            <Text style={{fontWeight:'bold'}}>自己紹介文: </Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={()=>setPromotionEdit(true)}  
            >
              <Text>編集</Text>
            </TouchableOpacity>
          </View>
          <Text style={{padding: 16}}> {user?.promotion}</Text>
        </>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  promotionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButtonEditting: {
    backgroundColor: 'skyblue',
    paddingHorizontal: 16,
    paddingBottom: 4,
    paddingTop: 2,
    borderRadius: 8
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
    minHeight: 200,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 8
  }  
})
