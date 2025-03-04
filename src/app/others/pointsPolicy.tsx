import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import BannerAds from "@/src/components/template/BannerAds"
import { router } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function pointsPolicy(){

  return (
    <BackgroundTemplate>
      <ScrollView style={styles.scollView}>
        <Text selectable style={styles.title}>ハートポイント利用規約</Text>

        <Text selectable style={styles.subTitle}>第1条（目的）</Text>
        <Text selectable>
          本規約は、モバイル版HeartHospital（以下、「本アプリ」といいます）が提供する「ハートポイント」制度（以下、「本サービス」といいます）の利用条件を定めるものです。本サービスを利用するすべてのユーザーは、本規約に同意したものとみなします。
        </Text>

        <Text selectable style={styles.subTitle}>第2条（ハートポイントの獲得）</Text>
        <Text selectable>
          ユーザーは、以下の方法でハートポイント(以下、「ポイント」)を獲得できます。
        </Text>
        <Text selectable>(令和7年3月5日時点)</Text>
        <Text selectable style={{fontWeight: 'bold'}}>
          ・病院に関する口コミを投稿後に掲載の承認を得ると、1回につき150ポイント付与
        </Text>
        <Text selectable style={{fontWeight: 'bold'}}>
          ・おしゃべり場で育児に関する口コミを投稿すると、初回のみ30ポイント付与
        </Text>
        <Text selectable style={{fontWeight: 'bold'}}>
          ・ポイ活の動画広告を3回視聴たびに2ポイント付与
        </Text>
        <Text selectable style={{color: 'red', textDecorationLine: 'underline'}}>
          ※ 獲得できる方法とポイント数は暫定的なものであり、予告なく変更される場合があります。
        </Text>
        
        <Text selectable style={styles.subTitle}>第3条（ハートポイントの利用）</Text>
        <Text selectable>
          ユーザーは、ポイントを本サービスが提供する品と交換できます。ポイントの交換申請手続きは本アプリが定めるものとし、交換申請後のキャンセルは原則としてできません。
        </Text>

        <Text selectable style={styles.subTitle}>第4条（ハートポイントの管理）</Text>
        <Text selectable>
          ポイントはユーザーごとに管理され、譲渡・売買・貸与・換金することはできません。
        </Text>

        <Text selectable style={styles.subTitle}>第5条（不正行為の禁止）</Text>
        <Text selectable>
          以下の行為が判明した場合、本アプリはポイントの取消、アカウントの停止、その他必要な措置を講じることができます。
        </Text>
        <Text selectable>・虚偽の口コミ投稿</Text>
        <Text selectable>・不正な方法によるポイント取得</Text>
        <Text selectable>・その他、運営が不適切と判断した行為</Text>

        <Text selectable style={styles.subTitle}>第6条（サービスの変更・終了）</Text>
        <Text selectable>
          本アプリは、事前の通知なくポイント制度の内容を変更、または終了することがあります。サービス終了時に未使用のポイントが残っている場合、その補償は行いません。
        </Text>

        <Text selectable style={styles.subTitle}>第7条（免責事項）</Text>
        <Text selectable>
          本アプリは、ポイントの付与・交換に関して発生したトラブルについて、一切の責任を負いません。本サービスの利用により生じた損害について、本アプリの故意または重過失による場合を除き、一切の責任を負いません。
        </Text>

        <Text selectable style={styles.subTitle}>第8条（規約の変更）</Text>
        <Text selectable>
          本規約は、必要に応じて変更されることがあります。変更後の規約は、本アプリ上で告知した時点で効力を持つものとします。
        </Text>

        <Text selectable style={styles.subTitle}>附則</Text>
        <Text selectable>
          本規約は 令和7年3月5日より適用されます。
        </Text>

        <TouchableOpacity onPress={()=>router.push('/user/points')}>
          <Text style={styles.button}>ポイ活画面へ戻る</Text>
        </TouchableOpacity>

        <View style={{padding: 64}}/>
      </ScrollView>

      <View style={{position: 'absolute', bottom: 0}}>
        <BannerAds />
      </View>

    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  scollView: {
    width: '100%',
    padding: 32
  },
  title: {
    fontSize: 24,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginTop: 20
  },
  button: {
    backgroundColor: 'orange',
    color: 'white',
    width: 160,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
    textAlign: 'center',
    borderRadius: 32,
    margin: 'auto',
    marginTop: 16
  }
})
