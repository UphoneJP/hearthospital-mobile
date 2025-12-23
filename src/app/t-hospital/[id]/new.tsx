import { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { useSearchParams } from "expo-router/build/hooks"
import { router } from "expo-router"
import { Picker } from "@react-native-picker/picker"
import { Divider } from "react-native-paper"

import { hospitalType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import CustomInput from "@/src/components/parts/CustomInput"
import { AuthContext } from "@/src/context/loginContext"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { LoadingContext } from "@/src/context/loadingContext"
import { deleteData, getData, saveData } from "@/utils/asyncStorage"
import CustomButton from "@/src/components/parts/CustomButton"

export default function New(){
  const [hospital, setHospital] = useState<hospitalType|undefined>(undefined)
  const [titleName, setTitleName] = useState<string>('')
  const [diseaseNames, setDiseaseNames] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [comment, setComment] = useState<string>('')
  const [diseases, setDiseases] = useState<string[]>([])
  const id = useSearchParams().get('id')
  const {user} = useContext(AuthContext)
  const {backToHome} = useContext(AuthContext)
  const {setServerLoading, setLoadingPercentage} = useContext(LoadingContext)

  if(!id)return

  useEffect(()=>{

    async function fetchHospitals(){
      try {
        const loadHospitals = await getData('hospitals')
        if(loadHospitals){
          setHospital(JSON.parse(loadHospitals).find((hosp: hospitalType) => hosp._id === id))
          setServerLoading(false)
        } else {
          setServerLoading(false)
          await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
        }
      } catch {
        setServerLoading(false)
        await backToHome("病院情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    
    // 病名一覧の読み込み関数
    async function fetchDiseases(){
      try {
        const loadReviews = await getData('reviews')
        if(loadReviews){
          const allDiseases = JSON.parse(loadReviews).map((review: { diseaseNames: string[] }) => review.diseaseNames).flat()
          setDiseases([...new Set<string>(allDiseases)])
          setServerLoading(false)
        } else {
          Alert.alert('病名の一覧を取得できませんでした。')
          setServerLoading(false)
        }
      } catch {
        Alert.alert("病名の取得に失敗しました。")
      }
    }

    (async () => {
      setServerLoading(true)
      setLoadingPercentage(0)

      // 途中入力の読み込み
      const leftTitle = await getData(`${id}-title`)
      const leftDiseases = await getData(`${id}-diseases`)
      const leftYear = await getData(`${id}-year`)
      const leftMonth = await getData(`${id}-month`)
      const leftUrl = await getData(`${id}-url`)
      const leftComment = await getData(`${id}-comment`)
      setTitleName(leftTitle || '')
      setDiseaseNames(leftDiseases || '')
      setYear(Number(leftYear) || currentYear)
      setMonth(Number(leftMonth) || currentMonth)
      setUrl(leftUrl || '')
      setComment(leftComment || '')

      await fetchHospitals()
      await fetchDiseases()

      setServerLoading(false)
    })()

  }, [])

  async function sendFun () {
    try {
      setServerLoading(true)
      setLoadingPercentage(0)
      const axiosClient = await createAxiosClient()
      await axiosClient?.post(`/api/hospital/${id}/new`, {
        title: titleName.trim(),
        diseaseNames: diseaseNames.trim(),
        url: url.trim(),
        treatmentTiming: `${year}年${month}月頃`,
        comment: comment.trim(),
        userId: user?._id
      })
      Alert.alert('投稿いただきありがとうございます','管理人が確認後に掲載いたします。')
      deleteData(`${id}-title`)
      deleteData(`${id}-diseases`)
      deleteData(`${id}-year`)
      deleteData(`${id}-month`)
      deleteData(`${id}-url`)
      deleteData(`${id}-comment`)
      router.replace(`/t-hospital/${id}`)
    } catch {
      Alert.alert('投稿エラーが発生しました')
      setServerLoading(false)
    }
  }

  function func(disease: string){
    const newDiseaseNames = diseaseNames + ' ' + disease
    setDiseaseNames(newDiseaseNames)
  }

  return (
    <BackgroundTemplate>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>
            【{hospital?.hospitalname}】での経験を投稿
          </Text>

          <Divider />

          <CustomInput 
            label="タイトル"
            val={titleName}
            setVal={setTitleName}
            id={id}
            sessionName="title"
          />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>治療時期：</Text>
            <Picker 
              selectedValue={year} 
              style={{ flex:1 }} 
              onValueChange={async(value) => {
                setYear(value)
                await saveData(`${id}-year`, value.toString())
              }}
              
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
              onValueChange={async(value) => {
                setMonth(value)
                await saveData(`${id}-month`, value.toString())
              }}
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
            id={id}
            sessionName="diseases"
          />
          <Text style={styles.tips}>
            ※病名が複数の場合は、全角スペースまたは半角スペースを区切りとしてお使いください。
          </Text>
          <DiseasesBox 
            diseases={diseases}
            func={func}
          />

          <CustomInput 
            label="外部サイト(任意)"
            val={url}
            setVal={setUrl}
            style={{marginTop: 16}}
            id={id}
            sessionName="url"
          />
          <CustomInput 
            label="治療経験や医療従事者への謝意"
            val={comment}
            setVal={setComment}
            style={{height:400, marginTop: 16}}
            multiline={true}
            id={id}
            sessionName="comment"
          />

          <CustomButton
            title="口コミを投稿する"
            color={!titleName || !diseaseNames || !comment ? "#dddddd" : "orange"}
            disabledFun={!titleName || !diseaseNames || !comment ? true : false}
            fun={sendFun}
          />

        </View>
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
