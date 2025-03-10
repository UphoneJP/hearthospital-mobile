/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-require-imports */
import { router } from "expo-router"
import { useContext, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AntDesign } from '@expo/vector-icons'
import { AuthContext } from "@/src/context/loginContext"
import { pointType } from "@/src/types/types"

export default function PointsHeader () {
  const { user } = useContext(AuthContext)
  const [historyOpen, setHistoryOpen] = useState<boolean>(false)

  return (
    <>
      {/* ヘッダー */}
      <Text style={styles.title}>ポイ活</Text>

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{ fontWeight: "bold" }}>
            {user?.penName || user?.username}さんの
          </Text>
          <Text style={{ fontWeight: "bold" }}>
            保有ハートポイントは
          </Text>
          <Text style={styles.point}>
            {user?.points.map((point: pointType) => point.reward).reduce((sum: number, num: number) => sum + num, 0) || 0} pts
          </Text>
        </View>
        {/* ハートン */}
        <Image
          source={require('../../../assets/heartonOnly.png')}
          style={styles.hearton}
        />
      </View>

      {/* ハートポイント利用規約 */}
      <TouchableOpacity onPress={()=>router.push('/others/pointsPolicy')}>
        <Text style={styles.pointsPolicy}>
          ハートポイント利用規約
        </Text>
      </TouchableOpacity>

      {/* ハートポイント履歴 */}
      <TouchableOpacity onPress={()=>setHistoryOpen(prev=>!prev)}>
        <Text style={[styles.history, {
          borderBottomLeftRadius: historyOpen ? 0 : 16,
          borderBottomRightRadius: historyOpen ? 0 : 16
        }]}>
          ハートポイント履歴　
          {historyOpen?(
            <AntDesign name="closecircleo" size={12} color="white" />
          ) : (
            <AntDesign name="downcircleo" size={12} color="white" />
          )}
        </Text>
      </TouchableOpacity>

      {historyOpen && (
        <View style={styles.historyBox}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.date}>取得日</Text>
            <Text style={styles.from}>項目</Text>
            <Text style={styles.points}>ポイント数</Text>

          </View>
          {user?.points.map(point => {
            const date = new Date(point.madeAt)
            date.setHours(date.getHours() + 9)
            const timeOfGotPoints = date.toLocaleString('ja-JP').slice(0, 9)
            return (
              <View key={point._id} style={{flexDirection: 'row'}}>
                <Text style={styles.dateForData}>{timeOfGotPoints}</Text>
                <Text style={styles.fromForData}>{point.gettingFrom}</Text>
                <Text style={[styles.pointsForData, {color: point.reward >= 0 ? 'green': 'red'}]}>{point.reward}</Text>
              </View>
            )
          })}
        </View>
      )}
<<<<<<< HEAD

=======
>>>>>>> edf4333 (InterstitialAdsによりアプリがクラッシュしたため、再度作り直した。)
      <View style={{padding: 8}} />
    </>
  )
}
const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 8
  },
<<<<<<< HEAD
=======
  userPoints: { 
    flexDirection: "row", 
    justifyContent: 'center',
    marginVertical: 16
  },
>>>>>>> edf4333 (InterstitialAdsによりアプリがクラッシュしたため、再度作り直した。)
  point: {
    color: 'red', 
    fontWeight: 'bold', 
    fontSize: 32,
    textDecorationLine: 'underline',
    paddingVertical: 16
  },
  hearton: {
    width: 120, 
    height: 200, 
    objectFit: 'contain'
  },
  button: {
    color: 'white',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    textAlign: 'center',
    marginBottom: 16,
    margin: 'auto'
  },
  pointsPolicy: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 4,
    borderRadius: 16,
    margin: 'auto',
    textAlign: 'center'
  },
  history: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 4,
    borderRadius: 16,
    margin: 'auto',
    textAlign: 'center',
    marginTop: 8
  },
  historyBox: {
    backgroundColor: 'green',
    borderRadius: 16,
    width: '90%',
    margin: 'auto',
    marginTop: 0,
    padding: 16
  },
  date: {
    color: 'white',
    width: '30%',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center'
  },
  from: {
    color: 'white',
    width: '45%',
    textAlign: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white'
  },
  points: {
    color: 'white',
    width: '25%',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: 'white'
  },
  dateForData: {
    color: 'green',
    width: '30%',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#bbbbbb50',
    backgroundColor: '#eeeeee'
  },
  fromForData: {
    color: 'green',
    width: '45%',
    textAlign: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#bbbbbb50',
    backgroundColor: '#eeeeee'
  },
  pointsForData: {
    color: 'green',
    width: '25%',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#bbbbbb50',
    backgroundColor: '#eeeeee'
  }
})
