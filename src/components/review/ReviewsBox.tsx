import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { reviewType, type hospitalType } from "../../types/types"
import { router } from "expo-router"
import { SetStateAction, useContext } from "react"
import { AuthContext } from "@/src/context/loginContext"
import createAxiosClient from "@/utils/axiosClient"

interface PropsType {
  reviews: reviewType[] | undefined,
  jump?: boolean,
  setInputVal?: React.Dispatch<React.SetStateAction<string>>
  setHospital?: React.Dispatch<React.SetStateAction<hospitalType | undefined>>
}

export default function ReviewsBox ( prop: PropsType ) {
  const { reviews, jump, setInputVal, setHospital } = prop
  const { user } = useContext(AuthContext)

  function jumpFun (d: SetStateAction<string>) {
    if(jump)router.push(`/t-hospital/diseaseName?disease=${d}`)
    if(setInputVal)setInputVal(d)
  }

  return (
    <>
      {reviews?.map(review=>{

        async function deleteFun (){
          try {
            const axiosClient = await createAxiosClient()
            const response = await axiosClient?.post(`/api/hospital/${review.hospital}/${review._id}`, {user})
            Alert.alert('口コミを削除しました')
            if(setHospital) setHospital(response?.data.hospital)
          } catch {
            Alert.alert('エラーで削除できませんでした')
          }
        }
        
        return (
          <View key={review._id} style={styles.box}>

            {/* タイトル */}
            <Text selectable={true} style={styles.title}>{review.title}</Text>

            {/* 投稿者・投稿日・治療時期・詳細画面 */}
            <View style={styles.flexbox}>
              <View style={{width: '70%'}}>
                <Text selectable={true} style={styles.author}>
                  投稿者: 
                  <TouchableOpacity onPress={()=>router.push(`/others/${review.author?._id}`)}>
                    <Text selectable={true} style={styles.authorLink}>
                      {review?.author?.penName||review?.author?.username}
                    </Text>
                  </TouchableOpacity>
                </Text>
                <Text selectable={true} style={styles.tweetDate}>
                  投稿日:  {review.tweetDate}
                </Text>
                <Text selectable={true} style={styles.treatmentTiming}>
                  治療時期:  {review.treatmentTiming}
                </Text>
              </View>
              <View>
                <TouchableOpacity 
                  onPress={()=>{
                  router.push(`t-hospital/${review.hospital?._id}/${review._id}`)}}
                >
                  <Text style={styles.detail}>
                    詳細画面へ
                  </Text>
                </TouchableOpacity>
                {review.author?._id===user?._id&&(
                  <TouchableOpacity 
                    onPress={()=>Alert.alert(
                      '確認', 
                      '口コミを削除してよろしいですか？', 
                      [
                        { text: '削除する', onPress: deleteFun },
                        { text: 'キャンセル' , style: 'cancel'}
                      ]
                    )}
                  >
                    <Text style={[styles.detail, {backgroundColor: 'red'}]}>
                      削除
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* 病名 */}
            <View style={styles.dBox}>
              {review.diseaseNames.map(d => {
                return (
                  <TouchableOpacity 
                    key={d} 
                    style={styles.dButton}
                    onPress={()=>jumpFun(d)}
                  >
                    <Text selectable={true} style={styles.d}>{d}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* コメント */}
            <View style={styles.commentBox}>
              <ScrollView>
                <Text selectable={true} style={styles.comment}>
                  {review.comment}
                </Text>
              </ScrollView>
            </View>

            {/* SNSリンク */}
            {review.url&&
              <TouchableOpacity 
                onPress={()=>{Linking.openURL(review.url)}}
              >
                <Text style={styles.url}>SNSへのリンク</Text>
              </TouchableOpacity>
            }

        </View>
      )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  box: {
    width: '95%',
    marginHorizontal: 'auto',
    marginBottom: 12,
    paddingHorizontal: 4,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  flexbox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  author: {
    fontSize: 10
  },
  authorLink: {
    marginLeft: 8,
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 10
  },
  tweetDate: {
    fontSize: 10
  },
  treatmentTiming: {
    fontSize: 10
  },
  detail: {
    width: '100%',
    marginHorizontal: 'auto',
    marginVertical: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ffbb00',
    borderRadius: 8,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 12
  },
  dBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginVertical: 4
  },
  dButton: {
    display: 'flex'
  },
  d: {
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    backgroundColor: '#eeeeee',
    color: '#666666',
    fontSize: 12
  },
  commentBox: {
    maxHeight: 64
  },
  comment: {

  },
  url: {
    marginHorizontal: 'auto',
    marginVertical: 4,
    paddingVertical: 4,
    width: 80,
    backgroundColor: '#006600',
    borderRadius: 8,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 8
  }
})
