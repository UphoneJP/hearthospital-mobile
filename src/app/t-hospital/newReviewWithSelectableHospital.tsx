import CustomInput from "@/src/components/parts/CustomInput"
import RaisedButton from "@/src/components/parts/RaisedButton"
import DiseasesBox from "@/src/components/review/DiseasesBox"
import SelectableHospital from "@/src/components/review/SelectableHospital"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { AuthContext } from "@/src/context/loginContext"
import { hospitalType } from "@/src/types/types"
import createAxiosClient from "@/utils/axiosClient"
import { Picker } from "@react-native-picker/picker"
import { Divider } from "react-native-paper"
import { router } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import { saveToken, getToken, deleteToken } from "@/utils/secureStore"

export default function newReviewWithSelectableHospital (){
  const { user } = useContext(AuthContext)
  const [titleName, setTitleName] = useState<string>('')
  const [diseaseNames, setDiseaseNames] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [comment, setComment] = useState<string>('')
  const [diseases, setDiseases] = useState<string[]>([])
  const [hospitals, setHospitals] = useState<hospitalType[]|undefined>(undefined)
  const [selectedHospitalname, setSelectedHospitalname] = useState<string>("")

  useEffect(()=>{

    // 途中入力の読み込み
    (async () => {
      const leftHospital = await getToken('reveiwNoID-hospital')
      const leftTitle = await getToken('reveiwNoID-title')
      const leftDiseases = await getToken('reveiwNoID-diseases')
      const leftYear = await getToken('reveiwNoID-year')
      const leftMonth = await getToken('reveiwNoID-month')
      const leftUrl = await getToken('reveiwNoID-url')
      const leftComment = await getToken('reveiwNoID-comment')
      setSelectedHospitalname(leftHospital || '')
      setTitleName(leftTitle || '')
      setDiseaseNames(leftDiseases || '')
      setYear(Number(leftYear) || currentYear)
      setMonth(Number(leftMonth) || currentMonth)
      setUrl(leftUrl || '')
      setComment(leftComment || '')
    })()

    // 病名一覧の読み込み
    async function getAxiosClient(){
      try {
        const axiosClient = await createAxiosClient()
        const response = await axiosClient?.get('/api/hospital/reviews')
        const allDiseases = response?.data.reviews.map((review: { diseaseNames: string[] }) => review.diseaseNames).flat()
        setDiseases([...new Set<string>(allDiseases)])
      } catch {
        Alert.alert('病名の一覧を取得できませんでした。')
      }
    }
    getAxiosClient()
  }, [])

  async function sendFun () {
    try {
      setLoading(true)
      const selectedHospital = hospitals?.find(h=>h.hospitalname === selectedHospitalname)
      if(!selectedHospital) return Alert.alert('病院を選択してください')
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
      deleteToken('reveiwNoID-hospital')
      deleteToken('reveiwNoID-title')
      deleteToken('reveiwNoID-diseases')
      deleteToken('reveiwNoID-year')
      deleteToken('reveiwNoID-month')
      deleteToken('reveiwNoID-url')
      deleteToken('reveiwNoID-comment')
      router.replace(`/t-hospital/${selectedHospital?._id}`)
    } catch(e){
      console.log(e)
      Alert.alert('投稿エラーが発生しました。ご投稿内容をコピーし、ホーム画面へ一度戻ってから再度お試しください。')
      setLoading(false)
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
                await saveToken('reveiwNoID-year', value.toString())
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
                await saveToken('reveiwNoID-month', value.toString())
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

          <RaisedButton
            title="口コミを投稿する"
            color="green"
            disabled={!titleName || !diseaseNames || !comment || loading ? true : false}
            fun={sendFun}
            styleChange={{margin: 0}}
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
