import { useContext, useEffect, useState } from "react"
import { Alert, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AuthContext } from "../../context/loginContext"
import createAxiosClient from "@/utils/axiosClient"
import { LoadingContext } from "@/src/context/loadingContext"

export default function PenName () {
  const { user, setUser } = useContext(AuthContext)
  const [penNameEdit, setPenNameEdit] = useState<boolean>(false)
  const [penNameInput, setPenNameInput] = useState<string|undefined>(user?.penName)
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)

  useEffect(()=>{
    setPenNameInput(user?.penName)
  }, [user])

  async function changePenName () {
    Keyboard.dismiss()
    if (!penNameInput || penNameInput.length < 1) {
      Alert.alert('ペンネームを入力してください。')
      return
    }
    setServerLoading(true)
    setLoadingPercentage(0)
    setPenNameEdit(false)
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.patch(`/api/user/penName/${user?._id}`, {penNameInput})
      setUser(response?.data.user)
      Alert.alert('ペンネームを変更しました。')
      setServerLoading(false)
    } catch {
      Alert.alert('エラーが発生しました。')
      setServerLoading(false)
    }
  }

  return (
    <>
      {penNameEdit?(
        <View style={styles.penNameBox}>
          <Text style={{marginVertical: 'auto'}}>ペンネーム: </Text>
          <TextInput 
            autoFocus
            autoCapitalize='none'
            value={penNameInput}
            onChangeText={(text)=>setPenNameInput(text)}
            style={styles.editInput}
          />
          <TouchableOpacity 
            style={[styles.editButton, {backgroundColor: 'orange'}]}
            onPress={changePenName}  
          >
            <Text style={{color: 'white'}}>変更する</Text>
          </TouchableOpacity>
        </View>
      ):(
        <>
          <View style={styles.penNameBox}>
            <Text style={{fontWeight: 'bold'}}>ペンネーム: </Text>
            <Text style={{flex:1}}> {user?.penName}</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={()=>setPenNameEdit(true)}  
            >
              <Text>編集</Text>
            </TouchableOpacity>
          </View>
          {!user?.penName&&
            <Text style={{color: 'red'}}>
              ペンネームが設定されていない場合、「{user?.username}」が表示されます。
            </Text>
          }
        </>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  penNameBox: {
    flexDirection: 'row',
    marginBottom: 8
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
