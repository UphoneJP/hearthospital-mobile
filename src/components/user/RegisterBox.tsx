import { TextInput, Divider, Button } from 'react-native-paper'
import { useContext, useState } from 'react'
import { AuthContext } from '@/src/context/loginContext'
import { Keyboard, StyleSheet, Text } from 'react-native'
import EmailInputForm from './EmailInputForm'
import { LoadingContext } from '@/src/context/loadingContext'
import CustomCard from '../parts/CustomCard'

export default function RegisterBox(){
  const [penName, setPenName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  // const [authNum, setAuthNum] = useState<string>('')
  // const [answer, setAnswer] = useState<string>('')
  // const [expire, setExpire] = useState<number>(0)
  const [password, setPassword] = useState<string>('')
  const { register } = useContext(AuthContext)
  const { serverLoading } = useContext(LoadingContext)
  const buttonColor = email.length > 0 && password.length > 0 ? 'orange' : '#dddddd'

  return(
    <CustomCard>
      <>
        <Text style={styles.title}>
          新規HeartHospitalアカウント登録
        </Text>
      </>
      
      <Divider />

      <TextInput
        label={penName.length > 0 ? 'ペンネーム' : 'ペンネームを入力'}
        mode="outlined"
        value={penName}
        onChangeText={(text:string)=>setPenName(text)}
        autoCapitalize="none"
        outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
        contentStyle={{color: 'orange'}}
        theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
        style={{marginTop: 8}}
        right={penName.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
      />
      
      <EmailInputForm
        email={email}
        setEmail={setEmail}
        // authNum={authNum}
        // setAuthNum={setAuthNum}
        // setAnswer={setAnswer}
        // setExpire={setExpire}
      />

      <TextInput
        label={password.length > 0 ? 'パスワード' : 'パスワードを入力'}
        mode="outlined"
        value={password}
        onChangeText={(text:string)=>setPassword(text)}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="password"
        outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
        contentStyle={{color: 'orange'}}
        theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
        style={{marginBottom: 16}}
        secureTextEntry={true}
        right={password.length > 0 ? <TextInput.Icon icon="check" color="orange" /> : null}
      />

      <Button
        style={{
          borderColor: 'white',
          marginHorizontal: 40, 
          marginTop: 8
        }}
        mode="outlined"
        labelStyle={{ color: 'white' }}
        onPress={()=>{
          Keyboard.dismiss()
          register(penName, email, password)
        }}
        disabled={
          penName
          &&email
          // &&authNum===answer
          // &&Date.now() < expire
          &&password
          &&!serverLoading
          ? false : true 
        }
        contentStyle={{backgroundColor: buttonColor}}
      >
        新規ユーザー登録
      </Button>

    </CustomCard>
  )
}
const styles = StyleSheet.create({
  title: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 16 
  }
})
