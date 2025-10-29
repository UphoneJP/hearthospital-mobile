import { TextInput, Divider, Button } from 'react-native-paper'
import { useContext, useState } from 'react'
import { AuthContext } from '@/src/context/loginContext'
import { Keyboard, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import CustomCard from '../parts/CustomCard'
import { LoadingContext } from '@/src/context/loadingContext'

export default function LoginBox(){
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { login } = useContext(AuthContext)
  const buttonColor = email.length > 0 && password.length > 0 ? 'orange' : '#dddddd'
  const { serverLoading } = useContext(LoadingContext)

  return(
    <CustomCard>
      <>
        <Text style={styles.title}>
          HeartHospitalアカウントでログイン
        </Text>
      
        <Divider />

        <TextInput
          label={email.length > 0 ? 'Emailアドレス' : 'Emailアドレスを入力'}
          mode="outlined"
          value={email}
          onChangeText={(text:string)=>setEmail(text)}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
          contentStyle={{color: 'orange'}}
          theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
          style={{marginTop: 16}}
          right={email.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
        />

        <TextInput
          label={password.length > 0 ? 'パスワード' : 'パスワードを入力'}
          mode="outlined"
          value={password}
          onChangeText={(text:string)=>setPassword(text)}
          autoCapitalize="none"
          textContentType="password"
          outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
          contentStyle={{color: 'orange'}}
          theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
          style={{marginVertical: 16}}
          secureTextEntry={true}
          right={password.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
        />

        <Button
          style={{
            borderColor: 'white',
            marginHorizontal: 40, 
            marginTop: 16
          }}
          mode="outlined"
          labelStyle={{ color: 'white' }}
          onPress={()=>{
            Keyboard.dismiss()
            login(email, password)
          }}
          disabled={email&&password&&!serverLoading ? false : true}
          contentStyle={{backgroundColor: buttonColor}}
        >
          ログイン
        </Button>

        <TouchableOpacity onPress={()=>router.push('/user/resetPW')}>
          <Text style={styles.link}>パスワードの再設定・お忘れの方はこちら</Text>
        </TouchableOpacity>

      </>
    </CustomCard>
  )
}
const styles = StyleSheet.create({
  title: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 16 
  },  
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
    textAlign: 'center',
    marginTop: 32
  }
})
