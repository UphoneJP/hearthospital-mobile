import CustomInput from "@/src/components/parts/CustomInput"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import SelectableHospital from "@/src/components/review/SelectableHospital"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { AuthContext } from "@/src/context/loginContext"
import { hospitalType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import { Picker } from "@react-native-picker/picker"
import { Divider } from "react-native-paper"
import { router } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { deleteData, getData, saveData } from "@/utils/asyncStorage"
import { LoadingContext } from "@/src/context/loadingContext"
import CustomButton from "@/src/components/parts/CustomButton"

export default function newReviewWithSelectableHospital (){
  const { user, backToHome } = useContext(AuthContext)
  const [titleName, setTitleName] = useState<string>('')
  const [diseaseNames, setDiseaseNames] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [comment, setComment] = useState<string>('')
  const [diseases, setDiseases] = useState<string[]>([])
  const [hospitals, setHospitals] = useState<hospitalType[]|undefined>(undefined)
  const [selectedHospitalname, setSelectedHospitalname] = useState<string>("")
  const {setServerLoading, setLoadingPercentage} = useContext(LoadingContext)

  useEffect(()=>{
    async function fetchHospitals(){
      try {
        setServerLoading(true)
        setLoadingPercentage(0)

        // 途中入力の読み込み
        const leftHospital = await getData('reveiwNoID-hospital')
        const leftTitle = await getData('reveiwNoID-title')
        const leftDiseases = await getData('reveiwNoID-diseases')
        const leftYear = await getData('reveiwNoID-year')
        const leftMonth = await getData('reveiwNoID-month')
        const leftUrl = await getData('reveiwNoID-url')
        const leftComment = await getData('reveiwNoID-comment')
        setSelectedHospitalname(leftHospital || '')
        setTitleName(leftTitle || '')
        setDiseaseNames(leftDiseases || '')
        setYear(Number(leftYear) || currentYear)
        setMonth(Number(leftMonth) || currentMonth)
        setUrl(leftUrl || '')
        setComment(leftComment || '')

        // 病名一覧の読み込み
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
        setServerLoading(false)
        await backToHome("情報の取得に失敗しました。ホーム画面へ戻ります。")
      }
    }
    fetchHospitals()
  }, [])

  async function sendFun () {
    try {
      setServerLoading(true)
      setLoadingPercentage(0)
      const selectedHospital = hospitals?.find(h=>h.hospitalname === selectedHospitalname)
      if(!selectedHospital) {
        setServerLoading(false)
        return Alert.alert('病院を選択してください')
      }
      const axiosClient = await createAxiosClient()
      await axiosClient?.post(`/api/hospital/${selectedHospital?._id}/new`, 
        {
          title: titleName.trim(),
          diseaseNames: diseaseNames.trim(),
          url: url.trim(),
          treatmentTiming: `${year}年${month}月頃`,
          comment: comment.trim(),
          userId: user?._id
        }
      )
      Alert.alert('投稿いただきありがとうございます。','管理人が確認後に掲載いたします。')
      deleteData('reveiwNoID-hospital')
      deleteData('reveiwNoID-title')
      deleteData('reveiwNoID-diseases')
      deleteData('reveiwNoID-year')
      deleteData('reveiwNoID-month')
      deleteData('reveiwNoID-url')
      deleteData('reveiwNoID-comment')
      setServerLoading(false)
      router.replace(`/t-hospital/${selectedHospital?._id}`)
    } catch(e){
      console.log(e)
      Alert.alert('投稿エラーが発生しました。ご投稿内容をコピーし、ホーム画面へ一度戻ってから再度お試しください。')
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
            {user?.penName|| user?.username}さんの経験を投稿
          </Text>

          <Divider />

          {/* タイトル入力 */}
          <CustomInput 
            label="タイトル"
            val={titleName}
            setVal={setTitleName}
            sessionName="reveiwNoID-title"
          />

          {/* 病院選択 */}
          <SelectableHospital 
            selectedHospitalname={selectedHospitalname}
            setSelectedHospitalname={setSelectedHospitalname}
            hospitals={hospitals}
            setHospitals={setHospitals}
          />

          {/* 治療時期入力 */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>治療時期：</Text>
            <Picker 
              selectedValue={year} 
              style={{ flex:1 }} 
              onValueChange={async(value) => {
                setYear(value)
                await saveData('reveiwNoID-year', value.toString())
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
                await saveData('reveiwNoID-month', value.toString())
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

          {/* 病名入力 */}
          <CustomInput 
            label="病名"
            val={diseaseNames}
            setVal={setDiseaseNames}
            multiline={true}
            style={{height: 120}}
            sessionName="reveiwNoID-diseases"
          />
          <Text style={styles.tips}>
            ※病名が複数の場合は、全角スペースまたは半角スペースを区切りとしてお使いください。
          </Text>
          <DiseasesBox
            diseases={diseases}
            func={func}
          />

          {/* URL入力 */}
          <CustomInput 
            label="外部サイトURL(任意)"
            val={url}
            setVal={setUrl}
            style={{marginTop: 16}}
            sessionName="reveiwNoID-url"
          />

          {/* 内容入力 */}
          <CustomInput 
            label="治療経験や医療従事者への謝意"
            val={comment}
            setVal={setComment}
            style={{height:400, marginVertical: 16}}
            multiline={true}
            sessionName="reveiwNoID-comment"
          />

          <CustomButton
            title="口コミを投稿する"
            color={!titleName || !diseaseNames || !comment ? "#dddddd": "orange"}
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
    fontSize: 12,
    marginBottom: 8
  }
})
