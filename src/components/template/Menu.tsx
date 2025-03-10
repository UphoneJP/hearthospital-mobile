/* eslint-disable @typescript-eslint/no-require-imports */
import { StyleSheet, Text, Pressable, Animated, Image, TouchableOpacity, Alert } from 'react-native'
import { Divider } from 'react-native-paper'
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from '../../context/loginContext'
import MenuMain from './MenuMain'
import MenuAccount from './MenuAccount'
import MenuOthers from './MenuOthers'
import { router } from 'expo-router'
import { MenuContext } from '@/src/context/menuContext'
import { useTab } from '@/src/context/tabContext'


export default function Menu(){
  const {menuVisible, toggleMenu} = useContext(MenuContext)
  const [isMounted, setIsMounted] = useState(menuVisible)
  const { isLoggedIn, user } = useContext(AuthContext)
  const { onTabPress } = useTab()

  const translateX = useRef(new Animated.Value(-300)).current
  const maskOpacity = useRef(new Animated.Value(0)).current
  const heartonOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (menuVisible) {
      setIsMounted(true)
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(maskOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(heartonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start()
    }
  }, [menuVisible])

  useEffect(() => {
    if (!isMounted) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -300,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(heartonOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          })
        ]),
        Animated.timing(maskOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start(() => toggleMenu())
    }
  }, [isMounted])

  return (
    <>
      {/* mask */}
      <Animated.View style={[styles.mask, { opacity: maskOpacity }]}>
        <Pressable onPress={()=>setIsMounted(!isMounted)} style={{ flex: 1 }} />
      </Animated.View>

      <Animated.View 
        style={[styles.hertonBack, { opacity: heartonOpacity }]} 
      >
        <TouchableOpacity onPress={()=>{
          toggleMenu()
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
        }}>
          <Image 
            source={require('./../../../assets/hearton.png')}
            style={styles.hearton}
          />
        </TouchableOpacity>
        
      </Animated.View>

      {/* drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>

        <Text style={styles.title}>
          {isLoggedIn? 
            `${user?.penName || user?.username}さん: ログイン中` :
            'ようこそ HeartHospitalへ'
          }
        </Text>
      <Divider bold style={{marginTop: 8}}/>
        <MenuMain toggleMenu={toggleMenu}/>
      <Divider bold style={{marginTop: 8}}/>
        <MenuAccount toggleMenu={toggleMenu} />
      <Divider bold style={{marginTop: 8}}/>
        <MenuOthers toggleMenu={toggleMenu} />

      </Animated.View>
      
    </>
  )
}
const styles = StyleSheet.create({
  mask: {
    backgroundColor: 'gray',
    opacity: .5,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 5
  },
  hertonBack: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    zIndex: 20
  },
  hearton: {
    width: 160,
    height: 160
  },
  drawer: {
    position: 'absolute',
    left: 0,
    width: '70%',
    height: '100%',
    zIndex: 10,
    backgroundColor: 'white',
    padding: 8
  },
  title: {
    textAlign: 'center',
    fontSize: 16
  }
})
