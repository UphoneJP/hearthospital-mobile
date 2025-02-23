import { router } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import {Ionicons} from '@expo/vector-icons'

interface PropsType {
  recieverName: string
  personId: string | null
}

export default function MessageHeader({recieverName, personId}:PropsType){
  return (
    <View style={{width: '100%', padding: 16, backgroundColor: 'orange'}}>
      <TouchableOpacity onPress={()=>router.push('/user/chat')}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          position: 'absolute', 
          alignSelf: 'center'
        }}
        onPress={()=>router.push(`/others/${personId}`)}
      >
        <Text style={{
          color: 'white', 
          padding: 12, 
          fontSize: 20
          }}
        >
          {recieverName}さん
        </Text>
      </TouchableOpacity>
    </View>
  )
}
