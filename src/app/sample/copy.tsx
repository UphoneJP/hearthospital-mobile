/* eslint-disable @typescript-eslint/no-require-imports */
import { Animated, Image, StyleSheet, Text, TouchableOpacity } from "react-native"
import { useEffect, useRef } from "react"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { router } from "expo-router"
import { useTab } from "@/src/context/tabContext"


export default function Home() {
  const { onTabPress } = useTab()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateAnim = useRef(new Animated.Value(0)).current 
  const textFadeAnim = useRef(new Animated.Value(0)).current
  const heartonOpacity = useRef(new Animated.Value(0)).current
  const heartonMove = useRef(new Animated.Value(60)).current
  const heartonRotate = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.sequence([
      // ロゴのフェードイン
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      }),
      // ロゴの上方向への移動
      Animated.timing(translateAnim, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true
      }),
      // テキストのフェードイン
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      // ハートン出現
      Animated.parallel([
        Animated.timing(heartonOpacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(heartonMove, {
          toValue: 30,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(heartonRotate, {
          toValue: -15,
          duration: 300,
          useNativeDriver: true
        })
      ]),
      Animated.parallel([
        Animated.timing(heartonMove, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(heartonRotate, {
          toValue: 15,
          duration: 300,
          useNativeDriver: true
        })
      ]),
      Animated.parallel([
        Animated.timing(heartonMove, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(heartonRotate, {
          toValue: -15,
          duration: 300,
          useNativeDriver: true
        })
      ]),
      Animated.parallel([
        Animated.timing(heartonMove, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(heartonRotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ])
    ]).start()
  }, [])

  return (
    <BackgroundTemplate>
      <Animated.Image
        source={require('../../../assets/HeartHospital-wide-throw.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }]
          }
        ]}
        resizeMode="contain"
      />
      <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
        <Text style={styles.title}>幸せのバトンをつなげよう</Text>
        <Text style={styles.main}>患者とその家族の経験を蓄積する場</Text>
        <Text style={styles.main}>子供たちとそのご家族の</Text>
        <Text style={styles.main}>幸せに繋がりますように</Text>
      </Animated.View>

      {/* <Animated.View 
        style={[
          styles.hertonBack, 
          { transform: [{translateX: heartonMove}, {rotate: `${heartonRotate}deg`}] }
        ]} 
      >
        <TouchableOpacity onPress={()=>{
          // onTabPress('newReview')
          // router.push('/t-hospital/newReviewWithSelectableHospital')
        }}>
          <Image 
            source={require('../../../assets/hearton.png')}
            style={styles.hearton}
          />
        </TouchableOpacity>
        
      </Animated.View> */}
        
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  logo: {
    width: 250,
    height: 150,
    alignSelf: 'center'
  },
  textContainer: {
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16
  },
  main: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 8
  },
  hertonBack: {
    position: 'absolute',
    right: 24,
    bottom: 64,
    zIndex: 20
  },
  hearton: {
    width: 160,
    height: 160
  }
})
