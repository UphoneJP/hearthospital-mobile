/* eslint-disable @typescript-eslint/no-require-imports */
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useContext, useEffect, useRef, useState } from "react"
import BackgroundTemplate from "@/src/components/template/BackgroundTemplate"
import { MenuContext } from "@/src/context/menuContext"
import { useTab } from "@/src/context/tabContext"
import { router } from "expo-router"
import { AuthContext } from "@/src/context/loginContext"
import Tips from "@/src/components/template/Tips"
import { getToken, saveToken } from "@/utils/secureStore"
import { LoadingContext } from "@/src/context/loadingContext"
import getApiKey from "@/utils/getApiKey"
import reloadInfo from "@/utils/reloadInfo"

export default function Home() {
  const [showTips, setShowTips] = useState(false)
  const [startOK, setStartOK] = useState(false)
  const { menuVisible } = useContext(MenuContext)
  const { user } = useContext(AuthContext)
  const { onTabPress } = useTab()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateAnim = useRef(new Animated.Value(0)).current
  const textFadeAnim = useRef(new Animated.Value(0)).current
  const heartonOpacity = useRef(new Animated.Value(0)).current
  const heartonMoveX = useRef(new Animated.Value(0)).current
  const heartonMoveY = useRef(new Animated.Value(0)).current
  const heartonRotate = useRef(new Animated.Value(0)).current
  const { setServerLoading, setLoadingPercentage } = useContext(LoadingContext)

  useEffect(() => {
    (async () => {
      try {
        // インストール後初めて Tips表示
        const isFirstLaunchDone = await getToken('isFirstLaunchDone')
        if (!isFirstLaunchDone) {
          setTimeout(() => setShowTips(true), 6000)
          await saveToken('isFirstLaunchDone', 'true')
        }
        
        setServerLoading(true)
        setLoadingPercentage(0)

        // 前回APIキー取得から5分以内なら再取得しない
        const lastContactTime = await getToken('lastContactTime')
        if (lastContactTime && Date.now() > parseInt(lastContactTime) + 1000 * 60 * 1) {
          await getApiKey()
          setLoadingPercentage(50)
          await reloadInfo()
          setLoadingPercentage(100)
        }
        setStartOK(true)
        setServerLoading(false)

      } catch (err) {
        console.log('useEffectエラー:', err)
      }
    })()
  }, [])

  useEffect(() => {
    if(startOK){
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
          duration: 500,
          useNativeDriver: true
        }),
        Animated.sequence([
          Animated.timing(heartonOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
          }),
          Animated.parallel([
            Animated.timing(heartonMoveX, {
              toValue: 4,
              duration: 0,
              useNativeDriver: true
            }),
            Animated.timing(heartonMoveY, {
              toValue: -4,
              duration: 0,
              useNativeDriver: true
            }),
            Animated.timing(heartonRotate, {
              toValue: 3,
              duration: 0,
              useNativeDriver: true
            })
          ]),
          Animated.parallel([
            Animated.timing(heartonMoveX, {
              toValue: 0,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            }),
            Animated.timing(heartonMoveY, {
              toValue: 0,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            }),
            Animated.timing(heartonRotate, {
              toValue: 0,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            })
          ]),
          Animated.parallel([
            Animated.timing(heartonMoveX, {
              toValue: 4,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            }),
            Animated.timing(heartonMoveY, {
              toValue: -4,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            }),
            Animated.timing(heartonRotate, {
              toValue: 3,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            })
          ]),
          Animated.parallel([
            Animated.timing(heartonMoveX, {
              toValue: 0,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            }),
            Animated.timing(heartonMoveY, {
              toValue: 0,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            }),
            Animated.timing(heartonRotate, {
              toValue: 0,
              duration: 0,
              delay: 300,
              useNativeDriver: true
            })
          ])
        ])
      ]).start()
    }
  }, [fadeAnim, translateAnim, textFadeAnim, startOK])

  return (
    <BackgroundTemplate>

      <TouchableOpacity
        style={{position: 'absolute', bottom: '15%', left: '10%'}}
        onPress={()=>setShowTips(true)}
      >
        <Animated.View style={[styles.textContainer, { opacity: textFadeAnim }]}>
          <Text style={{color: 'white', backgroundColor: 'orange', paddingBottom: 8, paddingTop: 6, paddingHorizontal: 16, borderRadius: 16 }}>アプリの使い方</Text>
        </Animated.View>
      </TouchableOpacity>
      {showTips&&
        <Tips setShowTips={setShowTips} />
      }

      <Animated.Image
        source={require('../../../assets/HeartHospital-wide-throw.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: translateAnim }
            ]
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

      <View style={{padding:50}} />

      {!menuVisible&&!showTips&&
        <TouchableOpacity
          style={styles.heartonBack}
          onPress={()=>{
           if(user){
              onTabPress('newReview')
              router.push('/t-hospital/newReviewWithSelectableHospital')
            } else {
              Alert.alert(
                "口コミ投稿にはログインが必要です。",
                "アカウント登録は無料です。",
                [
                  { text: 'キャンセル', style: 'cancel' },
                  { text: 'ログイン', onPress: ()=>router.push('/user/login') },
                  { text: '新規アカウント登録', onPress: ()=>router.push('/user/register') }
                ]
              )
            }
          }}
        >
          <Animated.Image
            source={require('../../../assets/hearton.png')}
            style={[ styles.hearton, {
              opacity: heartonOpacity,
              transform: [
                { translateX: heartonMoveX },
                { translateY: heartonMoveY },
                { rotate: heartonRotate.interpolate({
                  inputRange: [-3, 0, 3],
                  outputRange: ["-3deg", "0deg", "3deg"]
                })}
              ]
            }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      }

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
  heartonBack: {
    position: 'absolute',
    right: 40,
    bottom: 64
  },
  hearton: {
    width: 180,
    height: 180
  }
})
