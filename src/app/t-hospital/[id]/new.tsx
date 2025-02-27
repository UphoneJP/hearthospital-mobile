import { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { useSearchParams } from "expo-router/build/hooks"
import { router } from "expo-router"
import { Picker } from "@react-native-picker/picker"
import { Card } from "@rneui/themed"

import { hospitalType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import CustomInput from "@/src/components/parts/CustomInput"
import { AuthContext } from "@/src/context/loginContext"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import RaisedButton from "@/src/components/parts/RaisedButton"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"

export default function New(){
  const [hospital, setHospital] = useState<hospitalType|undefined>(undefined)
  const [titleName, setTitleName] = useState<string>('')
  const [diseaseNames, setDiseaseNames] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [comment, setComment] = useState<string>('')
  const [diseases, setDiseases] = useState<string[]>([])
  const id = useSearchParams().get('id')
  const {user} = useContext(AuthContext)


  useEffect(()=>{
    axiosClient.get(`/api/hospital/${id}`)
    .then((response)=>{
      setHospital(response.data.hospital)
    })
    .catch(()=>{
      Alert.alert("病院情報が取得できませんでした")
    })
    axiosClient.get('/api/hospital/reviews')
    .then((response)=>{
      const allDiseases = response.data.reviews.map((review: { diseaseNames: string[] }) => review.diseaseNames).flat()
      setDiseases([...new Set<string>(allDiseases)])
    })
    .catch(()=>{
      Alert.alert("病名の取得に失敗しました")
    })
  }, [])

  function sendFun () {
    axiosClient.post(`/api/hospital/${id}/new`, 
      {
        title: titleName.trim(),
        diseaseNames: diseaseNames.trim(),
        url: url.trim(),
        treatmentTiming: `${year}年${month}月頃`,
        comment: comment.trim(),
        user
      }
    ).then(()=>{
      Alert.alert('投稿いただきありがとうございます。確認後に掲載いたします。')
      router.replace(`/t-hospital/${id}`)
    }).catch(()=>{
      Alert.alert('投稿エラーが発生しました')
    })
  }

  function func(disease: string){
    const newDiseaseNames = diseaseNames + ' ' + disease
    setDiseaseNames(newDiseaseNames)
  }

  return (
    <BackgroundTemplate>
      <ScrollView>
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>
            【{hospital?.hospitalname}】での経験を投稿
          </Card.Title>

          <Card.Divider />

          <CustomInput 
            label="タイトル"
            val={titleName}
            setVal={setTitleName}
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>治療時期：</Text>
            <Picker 
              selectedValue={year} 
              style={{ flex:1 }} 
              onValueChange={(value) => setYear(value)}
              
            >
              {[...Array(30)].map((_, i) => (
                <Picker.Item 
                  key={i} 
                  label={`${currentYear - i}年`} 
                  value={currentYear - i}
                  style={{color: 'green'}} 
                />
              ))}
            </Picker>
            <Picker 
              selectedValue={month} 
              style={{ flex:1 }} 
              itemStyle={{ borderWidth: 1, borderColor: 'black'}}
              onValueChange={(value) => setMonth(value)}
            >
              {[...Array(12)].map((_, i) => (
                <Picker.Item 
                  key={i} 
                  label={`${i + 1}月頃`} 
                  value={i + 1}
                  style={{color: 'green'}} 
                />
              ))}
            </Picker>
          </View>

          <CustomInput 
            label="病名"
            val={diseaseNames}
            setVal={setDiseaseNames}
            multiline={true}
            style={{height: 120}}
          />
          <Text style={styles.tips}>
            ※病名が複数の場合は、全角スペースまたは半角スペースを区切りとしてお使いください。
          </Text>
          <DiseasesBox 
            diseases={diseases}
            func={func}
          />

          <CustomInput 
            label="外部サイトURL"
            val={url}
            setVal={setUrl}
            style={{marginTop: 16}}
          />
          <CustomInput 
            label="治療経験や医療従事者への謝意"
            val={comment}
            setVal={setComment}
            style={{height:400, marginTop: 16}}
            multiline={true}
          />

          <RaisedButton
            title="口コミを投稿する"
            color="green"
            disabled={!titleName || !diseaseNames || !comment ? true : false}
            fun={sendFun}
            styleChange={{margin: 32}}
          />

        </Card>
        <View style={{padding: 64}} />
              
      </ScrollView>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  card: {
    width: '95%',
    marginVertical: 16,
    margin: 'auto',
    padding: 16,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 30
  },
  title: {
    fontSize: 16
  },
  button: {
    // width: 300,
    marginHorizontal: 40
  },
  tips: {
    fontSize: 12
  }
})
