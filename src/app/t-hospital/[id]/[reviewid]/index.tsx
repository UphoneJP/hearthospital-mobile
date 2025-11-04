import { useSearchParams } from "expo-router/build/hooks"
import { SetStateAction, useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import { Linking } from "react-native"

import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { reviewType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import BannerAds from "@/src/components/template/BannerAds"
import { LoadingContext } from "@/src/context/loadingContext"
import { AuthContext } from "@/src/context/loginContext"

export default function ReveiwDetail () {
  const params = useSearchParams()
  const reviewId = params.get('reviewid')
  const [review, setReview] = useState<reviewType|undefined>(undefined)
  const {setServerLoading} = useContext(LoadingContext)
  const {backToHome} = useContext(AuthContext)


  useEffect(()=> {
    async function fetchReview(){
      setServerLoading(true)
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital/reviews')
        const rev = response?.data.reviews.filter((review: { _id: { toString: () => string | null } })=>review._id.toString()===reviewId)
        setReview(rev[0])
      } catch {
        await backToHome('病院情報を取得できませんでした。ホーム画面へ戻ります。')
      }
      setServerLoading(false)
    }
    fetchReview()
  }, [])


  const jumpFun = (d: SetStateAction<string>) => {
    router.push(`/t-hospital/diseaseName?disease=${d}`)
  }

  // if(loading || !review){
  //   return (
  //     <BackgroundTemplate>
  //       <ActivityIndicator size="large" color="orange" />
  //       <Text>サーバーから読み込み中...</Text>
  //     </BackgroundTemplate>
  //   )
  // }

  return (
    <BackgroundTemplate>

      {review && (
        <>
          <ScrollView style={{width: '100%'}}>

            {/* 病院名 */}
            <TouchableOpacity onPress={()=>router.push(`/t-hospital/${review.hospital?._id}`)}>
              <Text selectable={true} style={[styles.hospitalname, styles.link]}>
                {review.hospital?.hospitalname}
              </Text>
            </TouchableOpacity>

            {/* タイトル */}
            <Text selectable={true} style={styles.title}>{review.title}</Text>

            {/* 投稿者 */}
            <Text selectable={true} style={styles.author}>
              投稿者: 
              <TouchableOpacity onPress={()=>router.push(`/others/${review.author?._id}`)}>
                <Text style={styles.link}>
                  {review?.author?.penName||review?.author?.username}
                </Text>
              </TouchableOpacity>
            </Text>

            {/* SNSリンク */}
            {review.url&&
              <TouchableOpacity 
                onPress={()=>{Linking.openURL(review.url)}}
              >
                <Text style={styles.url}>SNSへのリンク</Text>
              </TouchableOpacity>
            }

            {/* 投稿日・治療時期・詳細画面 */}
            <Text style={styles.tweetDate}>
              投稿日:  {review.tweetDate}
            </Text>
            <Text style={styles.treatmentTiming}>
              治療時期:  {review.treatmentTiming}
            </Text>

            {/* 病名 */}
            <View style={styles.dBox}>
              {review.diseaseNames.map(d => {
                return (
                  <TouchableOpacity 
                    key={d} 
                    style={styles.dButton}
                    onPress={()=>jumpFun(d)}
                  >
                    <Text style={styles.d}>{d}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            {/* コメント */}
            <View style={styles.commentBox}>
              <ScrollView>
                <Text selectable={true}>
                  {review.comment}
                </Text>
              </ScrollView>
            </View>

            <View style={{padding:64}} />

          </ScrollView>

          <BannerAds />
        </>
      )}

    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  hospitalname: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  headerBox: {
    flex: 1, 
    justifyContent: 'center',
    padding: 8
  },
  author: {
    textAlign: 'center',
    marginTop: 8
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue'
  },
  url: {
    marginHorizontal: 'auto',
    marginVertical: 4,
    paddingTop: 4,
    paddingBottom: 8,
    width: 120,
    backgroundColor: '#006600',
    borderRadius: 8,
    textAlign: 'center',
    color: '#ffffff'
  },
  tweetDate: {
    textAlign: 'center'
  },
  treatmentTiming: {
    textAlign: 'center'
  },
  websiteText: {
    marginHorizontal: 'auto',
    marginVertical: 4,
    paddingTop: 4,
    paddingBottom: 8,
    width: 160,
    borderRadius: 8,
    textAlign: 'center',
    color: '#ffffff',
    backgroundColor: '#0000ff'
  },
  dBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 4,
    marginTop: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 8
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
    color: '#666666'
  },
  commentBox: {
    padding: 16
  }
})

