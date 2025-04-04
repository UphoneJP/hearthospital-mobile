/* eslint-disable @typescript-eslint/no-require-imports */
import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function Tips({setShowTips}: {setShowTips: (value: boolean) => void}) {
  const [tipsNum, setTipsNum] = useState(0)
  const fadeMask = useRef(new Animated.Value(0)).current
  const fadeTextBox = useRef(new Animated.Value(0)).current
  const fadeImage = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeMask, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(fadeTextBox, {
        toValue: 1,
        duration: 500,
        delay: 1000,
        useNativeDriver: true
      })
    ]).start()
  }, [fadeMask])

  function handleNext() {
    Animated.parallel([
      Animated.timing(fadeTextBox, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeImage, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      if (tipsNum === 6) {
        setShowTips(false)
      } else {
        setTipsNum(prev => prev + 1)
        Animated.parallel([
          Animated.timing(fadeTextBox, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(fadeImage, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          })
        ]).start()
      }
    })
  }

  return (
    // Mask
    <Animated.View style={[styles.mask, { opacity: fadeMask }]}>

      {/* Skip */}
      <TouchableOpacity style={styles.skip} onPress={() => setShowTips(false)}>
        <MaterialCommunityIcons name="skip-forward" size={24} color="gray" />
        <Text style={{color: 'gray'}}>説明を省略する</Text>
      </TouchableOpacity>

      {/* ハートン */}
      <Animated.Image 
        source={imagesOfHearton[tipsNum]}
        style={[ styles.hearton, {opacity: fadeImage} ]}
      />

      {/* 吹き出しテキスト */}
      <Animated.View style={[styles.textBox, { opacity: fadeTextBox }]}>
        <Text style={styles.text}>
          {tipsNum===0?
            'HeartHospitalへようこそ!!ボクは『ハートン』、よろしくね。あなたと家族の幸せをサポートするアプリだよ。このアプリの使い方を一緒に見てみよう！'
            :tipsNum===1?
              'まずは、画面下部のタブメニューから説明するよ。タブメニューは常に表示されていて、タップするとページを移動できるよ。今はHOMEボタンの色が変わっているね。HOMEページにいることがわかるよ!!'
            :tipsNum===2?
              '次に、病院検索ボタンがあるよ。地図や地方名から『小児心臓外科手術ができる病院』を探せるよ。各病院での経験談（口コミ）も見られるよ。あなたの経験談もぜひ共有してほしいな。'
            :tipsNum===3?
              'ここは病院データボタンだよ。毎年各病院から病院指標というデータが公開されるんだ。独自フィルタリングしたものをグラフ化しているよ。全国にある病院の症例数が比較できたり、各病院の症例数の推移も見られるよ。'
            :tipsNum===4?
              '4つ目のボタンはおしゃべり場!!自由に作ったテーマに沿って子育ての悩みやヒントを共有し合う掲示板だよ。気楽にみんなで情報交換して、子育てを楽しもう!!'
            :tipsNum===5?
              'あと、右上に可動式のメニューボタンがあるよ。ここからアカウント作成や、お問い合わせ、お知らせ等を見ることができるんだ。ログインすると、【ポイ活】もできるし、チャットで連絡も取り合えるよ。アカウントを作って、機能をフルに使いこなそう!!'
            :tipsNum===6?
              '説明はこれでおしまいだよ。あなたの投稿はきっとみんなの力になるから、ぜひ投稿してね。ハートンとの約束だよ!!それじゃあ、またね!!'
            :''
          }
        </Text>
        <View style={styles.bottom}>
          <TouchableOpacity 
            onPress={() => setTipsNum(prev => prev - 1)}
            disabled={tipsNum===0}
          >
            <Text style={{color: tipsNum===0?'transparent':'gray'}}>戻る</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <Text style={{color: 'orange'}}>
              {tipsNum!==6?'次へ':'アプリをスタート'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* pointer */}
      {tipsNum < 5 && 
        <MaterialCommunityIcons 
          name="hand-pointing-down" 
          size={48} 
          color="red"
          style={[styles.pointer, { 
            left: 
              tipsNum===1?'8%'
              :tipsNum===2?'32%'
              :tipsNum===3?'57%'
              :tipsNum===4?'82%':0,
            color: tipsNum===0?'transparent':'red'
          }]}
        />
      }
      {tipsNum===5 &&
        <MaterialCommunityIcons 
          name="hand-pointing-right" 
          size={48} 
          color="red"
          style={{position: 'absolute', right: 96, top: 72}}  
        />
      }
      
      
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  mask: {
    backgroundColor: '#dddddd99',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5
  },
  skip: {
    alignSelf: 'flex-start',
    margin: 32,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16
  },
  hearton: {
    width: 200, 
    height: 200, 
    objectFit: 'contain'
  },
  textBox: {
    backgroundColor: '#ffffff',
    // padding: 24,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'orange',
    marginHorizontal: 16
  },
  text: {
    padding: 32,
    overflow: 'visible'
  },
  bottom: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 16 
  },
  pointer: { 
    position: 'absolute', 
    bottom: 12 
  }
})
const imagesOfHearton = [
  require('../../../assets/hearton-holding.png'),
  require('../../../assets/hearton-jogging.png'),
  require('../../../assets/hearton-jumping.png'),
  require('../../../assets/heartonOnly.png'),
  require('../../../assets/hearton-laughing.png'),
  require('../../../assets/hearton-wearing-sunglasses.png'),
  require('../../../assets/hearton-heart.png')
]
