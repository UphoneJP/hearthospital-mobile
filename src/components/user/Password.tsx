import { Text, View } from "react-native"
import RaisedButton from "../parts/RaisedButton"
import { useContext } from "react"
import { AuthContext } from "../../context/loginContext"
import { router } from "expo-router"

export default function Password () {
  const {user} = useContext(AuthContext)
  return (
    <View style={{flexDirection:'row'}}>
      <Text style={{fontWeight:'bold'}}>パスワード: </Text>
      <Text style={{flex:1}}>
        {user?.googleId?(
          <View>
            <RaisedButton
              title="Googleアカウントでログイン中"
              color="orange"
              disabled={true}
            />
          </View>
        ) : ( user?.appleUserId ? (
          <View>
            <RaisedButton
              title="appleアカウントでログイン中"
              color="orange"
              disabled={true}
            />
          </View>
        ) : (
          <View>
            <RaisedButton
              title="パスワードを変更する"
              color="blue"
              fun={()=>router.push('/user/resetPW')}
            />
          </View>
        ))}
      </Text>
    </View>
  )
}
