import { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AuthContext } from "@/src/context/loginContext"
import EarningPoints from "../template/EarningPoints"
import CustomCard from "../parts/CustomCard"

export default function PointsGet () {
  const { user } = useContext(AuthContext)
  const [spentTime, setSpentTime] = useState<number>(0)

  const remainingTime = 1000 * 60 * 60 * 23 - spentTime
  const canWatchAd = remainingTime <= 0
  const hours = Math.floor(remainingTime / (1000 * 60 * 60))
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000)
  
  useEffect(() => {
    if (user?.timeOfGotPoint) {
      const updateSpentTime = () => {
        setSpentTime(new Date().getTime() - new Date(user.timeOfGotPoint).getTime())
      }
      updateSpentTime()
      const intervalId = setInterval(updateSpentTime, 1000)
      return () => clearInterval(intervalId)
    } else {
      setSpentTime(1000 * 60 * 60 * 23)
    }
  }, [user?.timeOfGotPoint])

  return (
    <CustomCard>
      <View style={{flexDirection: 'row'}}>
        <MaterialCommunityIcons name="numeric-1-box" size={20} color="orange" />
        <Text style={{ color: 'orange' }}>
          ハートポイントをGET
        </Text>
      </View>
      {!user?.points.length || canWatchAd ? (
        <EarningPoints />
      ) : (
        <>
          <Text style={{textAlign: 'center'}}>広告視聴が可能になるまで</Text>
          <Text style={styles.remainingTime}>{hours}時間 {minutes}分 {seconds}秒</Text>            
        </>
      )}
    </CustomCard>
  )
}
const styles = StyleSheet.create({
  remainingTime: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: 'orange',
    fontWeight: 'bold'
  }
})
