import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { AuthContext } from "@/src/context/loginContext"
import { useTab } from "@/src/context/tabContext"
import { userType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import { router } from "expo-router"
import { useSearchParams } from "expo-router/build/hooks"
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"


export default function othersPage () {
  const [otherPerson, setOtherPerson] = useState<userType|undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useContext(AuthContext)
  const { onTabPress } = useTab()
  const id = useSearchParams().get('othersId')
  
  useEffect(()=>{
    async function getAxiosClient(){
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.post('/api/others/othersPage', {id})
        setOtherPerson(response?.data.other)
        setLoading(false)
      } catch {
        Alert.alert('相手のデータを取得できませんでした')
      }
    }
    getAxiosClient()
  }, [])

  if(loading){
    return (
      <BackgroundTemplate>
        <ActivityIndicator size="large" color="orange" />
        <Text>サーバーから読み込み中...</Text>
      </BackgroundTemplate>
    )
  }

  return (
    <BackgroundTemplate>
      <View style={styles.visibleBox}>
        <View style={styles.section}>
          <Text style={styles.title}>ペンネーム:</Text>
          <Text selectable={true} style={styles.content}>{otherPerson?.penName || otherPerson?.username}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>紹介文:</Text>
          <Text selectable={true} style={styles.content}>{otherPerson?.promotion}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>投稿した口コミ:</Text>
          <View style={styles.content}>
            {otherPerson?.reviews?.map(review => {
              return (
                <TouchableOpacity key={review._id} onPress={()=>router.push(`/t-hospital/${review.hospital}/${review._id}`)}>
                  <Text style={styles.link}>
                    {review.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        <TouchableOpacity 
          onPress={()=>{
            router.push(`/user/chat/${user?._id}/${otherPerson?._id}`)
            onTabPress('chat')
          }}
        >
          <Text style={styles.messageButton}>
            ダイレクトメッセージを送る
          </Text>
        </TouchableOpacity>
        
      </View>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  visibleBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#666666',
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: '80%',
    margin: 'auto'
  },
  section: {
    flexDirection: 'row', 
    gap: 16,
    marginVertical: 8
  },
  title: {
    color: 'gray'
  },
  content: {
    flex: 1
  },
  messageButton: {
    backgroundColor: 'orange',
    color: 'white',
    textAlign: 'center',
    margin: 32,
    paddingBottom: 8,
    paddingTop: 4,
    borderRadius: 8
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue'
  }
})
