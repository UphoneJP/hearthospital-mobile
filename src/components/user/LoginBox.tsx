import { Card, Input } from '@rneui/themed'
import { useContext, useState } from 'react'
import RaisedButton from '../parts/RaisedButton'
import { AuthContext } from '@/src/context/loginContext'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

export default function LoginBox(){
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { login } = useContext(AuthContext)

  return(
    <Card containerStyle={styles.card}>

      <Card.Title style={{fontSize: 16}}>
        HeartHospitalアカウントでログイン
      </Card.Title>
      
      <Card.Divider />
      
      <Input
        placeholder='Emailアドレス'
        value={email}
        onChangeText={(text)=>setEmail(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <Input 
        placeholder="パスワード" 
        value={password}
        onChangeText={(text)=>setPassword(text)}
        autoCapitalize="none"
        secureTextEntry={true}
        textContentType="password"
      />

      <RaisedButton 
        title={loading? <ActivityIndicator size='small' color='orange'/> : 'ログイン'}
        color='orange'
        fun={()=>{
          if(!email || !password) return
          setLoading(true)
          login(email, password)
        }}
        disabled={email&&password&&!loading ? false : true }
        styleChange={styles.button}
      />

      <TouchableOpacity onPress={()=>router.push('/user/resetPW')}>
        <Text style={styles.link}>パスワードの再設定・お忘れの方はこちら</Text>
      </TouchableOpacity>

    </Card>
  )
}
const styles = StyleSheet.create({
  card: {
    width: '90%',
    padding: 24,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 30
  },
  button: {
    // width: 300,
    marginHorizontal: 40
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
    textAlign: 'center',
    marginTop: 32
  }
})
