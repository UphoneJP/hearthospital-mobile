/* eslint-disable @typescript-eslint/no-require-imports */
import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import BannerAds from "@/src/components/template/BannerAds"
import Topic from "@/src/components/template/Topic"
import { Image, ScrollView, StyleSheet, Text, View } from "react-native"

export default function news(){
  
  return(
    <BackgroundTemplate>
      <ScrollView style={{width: '100%'}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 16}}>
          <Text style={styles.headerTitle}>お知らせ</Text>
          <Image source={require('@/assets/hearton-singing.png')} style={{width: 120, height: 160, objectFit: 'contain'}}/>
        </View>
        <View style={styles.container}>

          <Topic
            date="2025/03/10"
            title="全員150ポイントGETのチャンス!!"
            content=" 病院口コミして掲載承認が得られた時点で150ポイントがGETできるよ。 おしゃべり場での初回投稿で30ポイントもGETできる!! 投稿には時間も手間もかかるけど、投稿した人にささやかなお返しができるシステムになっているよ。 ぜひ投稿してね!!"
            backImageNum={3}
            textColor="#ed6b00"
          />

          <Topic
            date="2025/03/10"
            title="ポイ活でハートポイントを貯めよう!!"
            content=" HeartHospitalモバイルアプリではポイ活機能が実装されたよ。 新規アカウント登録してログインすると、ハートポイントを貯められるようになるよ。 メニューから「ポイ活」を選択してね。 『動画広告視聴』でハートポイントをGETできるよ!! ハートポイントはデジタルギフトカード等に交換できるから、ドンドン集めてね。"
            backImageNum={2}
            textColor="green"
          />

          <Topic
            date="2025/03/10"
            title="アプリ内の主な機能は5つ"
            content=" HeartHospitalは先天性心疾患の子と家族の経験を蓄積して共有するよ。 機能は大きく分けて5つ!! ①地図や地域名から病院を探したり、病名から口コミを検索できるよ。 ②全国の病院の小児心臓手術件数がグラフで見られるよ。 ③心臓病児の子育てに関する掲示板。 ④ダイレクトメッセージ機能(リアルタイム通信を採用)。 ⑤ポイ活。 5つのうち④と⑤はモバイルアプリ限定の機能だよ!!"
            backImageNum={1}
            textColor="red"
          />

          <Topic
            date="2025/03/10"
            title="HeartHospitalモバイルアプリが新登場!!"
            content=" アンドロイドアプリHeartHospitalが新登場!! スマホでの使いやすさや見やすさが大幅に向上したよ!! ボクはこのアプリの新キャラクターで、名前は『ハートン』っていうんだ。 ボクと一緒にアプリ内を見て回ろう!!"
            backImageNum={0}
            textColor="blue"
          />
          
        </View>

        <View style={{padding: 64}} />
      </ScrollView>

      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>

    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  container: {
    width: '100%', 
    flexDirection: 'row', 
    flexWrap: 'wrap'
  }
})
