import { useContext } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AuthContext } from "@/src/context/loginContext"
import { talkThemeType } from "@/src/types/types"
import axiosClient from "@/utils/axiosClient"
import NativeAds from "@/src/components/template/NativeAds"

interface PropsType {
  talkTheme: talkThemeType | undefined
  id: string | null
  setNum: React.Dispatch<React.SetStateAction<number>>
}

export default function Talks ({talkTheme, id, setNum}:PropsType) {
  const { user } = useContext(AuthContext)
  const talksLength = talkTheme?.talks?.length || 0

  function confirmFun(talkId: string) {
    Alert.alert(
      '指定のコメントを削除します',
      '削除すると戻すことはできませんが、削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel'},
        { text: '削除する', onPress: async ()=> await deleteFun(talkId)}
      ]
    )
  }
  async function deleteFun(talkId: string) {
    try {
      await axiosClient.delete(`/api/talkingRoom/${id}/${talkId}`)
      setNum(prev => prev + 1)
      Alert.alert('投稿を削除しました')
    } catch {
      Alert.alert('エラーにより削除できませんでした')
    }
  }

  return (
    <ScrollView style={{width: '100%'}}>
      {talkTheme?.talks?.map((talk, index)=>{
        const utcDate = new Date(talk.madeAt)
        const jstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000)        
        const tokyoTime = jstDate.toLocaleString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
        return (
          <View key={talk._id} style={styles.box}>
            {talk.deleted || talk.loggedInUser?.isDeleted ?(
              <>
                <View style={[styles.talkHeader, {backgroundColor: 'gray'}]}>
                  <Text>{talksLength - index}. 削除</Text>
                </View>
                <Text style={styles.content}>削除</Text>
              </>
            ):(
              <>
                <View style={
                  [
                    styles.talkHeader, 
                    {backgroundColor: bgcolors[talk.loggedInUser?.num || 0]}
                  ]
                }>
                  <Text selectable={true}>
                    {talksLength - index}. {talk.guestName || talk.loggedInUser?.penName || talk.loggedInUser?.username}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text selectable={true} style={styles.madeAt}>
                      {tokyoTime}
                    </Text>
                    {user && user._id === talk.loggedInUser?._id && 
                      <TouchableOpacity onPress={()=>confirmFun(talk._id)}>
                        <Text style={styles.deleteButton}>
                          削除
                        </Text>
                      </TouchableOpacity>
                    }
                  </View>
                    
                </View>
                
                <Text selectable={true} style={styles.content}>
                  {talk.content}
                </Text>
                
              </>
            )}
          </View>  
        )
      })}
      
      <View style={styles.adBox}>
        <NativeAds />
      </View>
      
      <View style={{padding:64}}></View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  box: {
    marginVertical: 4,
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 5
  },
  talkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderTopLeftRadius: 4,
    borderTopEndRadius: 4
  },
  madeAt: {
    fontSize: 12,
    color: '#666666'
  },
  content: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopWidth: 1
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginHorizontal: 8
  },
  adBox: {
    width: '70%',
    margin: 'auto',
    marginTop: 16
  }
})
const bgcolors = [
  'rgba(255, 99, 132, 0.8)',   // 赤
  'rgba(54, 162, 235, 0.8)',   // 青
  'rgba(255, 206, 86, 0.8)',   // 黄色
  'rgba(75, 192, 192, 0.8)',   // 水色
  'rgba(153, 102, 255, 0.8)',  // 紫
  'rgba(255, 159, 64, 0.8)',   // オレンジ
  'rgba(190, 190, 190, 0.8)',  // グレー
  'rgba(83, 102, 255, 0.8)',   // ディープブルー
  'rgba(120, 200, 246, 0.8)',  // ライトブルー
  'rgba(255, 193, 7, 0.8)',    // ゴールド
  'rgba(139, 195, 74, 0.8)',   // 緑
  'rgba(255, 87, 34, 0.8)',    // ディープオレンジ
  'rgba(158, 158, 158, 0.8)',  // ミディアムグレー
  'rgba(233, 30, 99, 0.8)',    // ピンク
  'rgba(121, 85, 72, 0.8)',    // ブラウン
  'rgba(96, 125, 139, 0.8)',   // ブルーグレー
  'rgba(244, 67, 54, 0.8)',    // レッド
  'rgba(0, 150, 136, 0.8)',    // ティール
  'rgba(103, 58, 183, 0.8)',   // ディープパープル
  'rgba(33, 150, 243, 0.8)',   // ライトブルー
  'rgba(156, 39, 176, 0.8)',   // 紫（ダーク）
  'rgba(0, 188, 212, 0.8)',    // シアン
  'rgba(190, 210, 57, 0.8)',   // ライム
  'rgba(3, 169, 244, 0.8)',    // ライトスカイブルー
  'rgba(255, 235, 59, 0.8)',   // イエロー
  'rgba(170, 170, 170, 0.8)',  // グレイッシュホワイト
  'rgba(255, 140, 0, 0.8)',    // ダークオレンジ
  'rgba(220, 0, 78, 0.8)',     // ディープピンク
  'rgba(76, 175, 80, 0.8)',    // グリーン
  'rgba(124, 179, 66, 0.8)'    // ライトグリーン
]
