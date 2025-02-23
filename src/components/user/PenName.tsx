import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AuthContext } from "../../context/loginContext"
import axiosClient from "@/utils/axiosClient"

export default function PenName () {
  const { user, setUser } = useContext(AuthContext)
  const [loading, setLoading] = useState<boolean>(false)
  const [penNameEdit, setPenNameEdit] = useState<boolean>(false)
  const [penNameInput, setPenNameInput] = useState<string|undefined>(user?.penName)

  useEffect(()=>{
    setPenNameInput(user?.penName)
  }, [user])

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
            style={styles.editButton}
            onPress={()=>{
              setLoading(true)
              setPenNameEdit(false)
              axiosClient.patch(`/api/user/penName/${user?._id}`, {penNameInput})
              .then((response)=>{
                setUser(response.data.user)
                Alert.alert('ペンネームを変更しました。')
                setLoading(false)
              })
              .catch(()=>{
                Alert.alert('エラーが発生しました。')
                setLoading(false)
              })
            }}  
          >
            <Text>変更</Text>
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
              {loading?(
                <ActivityIndicator size='small' color='white' />
              ):(
                <Text>編集</Text>
              )}
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
