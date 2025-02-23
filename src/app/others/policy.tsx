import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { useTab } from "@/src/context/tabContext"
import { router } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function policy(){
  const {onTabPress} = useTab()
  return (
    <BackgroundTemplate>
      <ScrollView style={styles.outerbox}>
        <Text style={styles.title}>利用規約</Text>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第1条（適用範囲）</Text>
          <Text>
            本利用規約（以下「本規約」 ）は、HeartHospital（以下「当アプリ」 ）が提供するサービス（以下「本サービス」 ）の利用に関する条件を定めるものです。本サービスを利用するすべてのユーザー（以下「ユーザー」 ）に適用されます。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第2条（アカウントの登録）</Text>
          <Text>
            ユーザーは、本サービスを利用するために、当アプリが定める方法によりアカウントを登録する必要があります。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第3条（アカウントの管理）</Text>
          <Text>
            ユーザーは、自己の責任においてアカウントを管理し、第三者に対してアカウントを利用させてはなりません。アカウントの不正利用による損害について、当アプリは一切の責任を負いません。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第4条（禁止事項）</Text>
          <Text>
            ユーザーは、本サービスの利用に際して、以下の行為を行ってはなりません。
          </Text>
          <Text>・法令または公序良俗に違反する行為</Text>
          <Text>・他のユーザー、第三者、または当アプリの権利を侵害する行為</Text>
          <Text>・虚偽の情報を提供する行為</Text>
          <Text>・有害なプログラムやスクリプトを送信する行為</Text>
          <Text>・サーバーに過度な負荷をかける行為</Text>
          <Text>・その他、当アプリが不適切と判断する行為</Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第5条（口コミの投稿）</Text>
          <Text>
            ユーザーは、本サービスを利用して病院に関する口コミを投稿することができます。投稿された病院に関する口コミは、当アプリの管理人による検閲と承認を経て、表示されるものとします。
            当アプリは、管理人の判断により以下に該当する病院に関する口コミを削除または表示しない権利を有します。
            また、おしゃべり場にて投稿された口コミは当アプリの管理人による検閲と承認は実施されないが、管理人の判断により以下に該当する口コミを削除または表示しない権利を有します。
          </Text>
          <Text>・悪評や悪口などの悪意のある投稿</Text>
          <Text>・自己の経験に基づかない風評を含む投稿</Text>
          <Text>・その他、当アプリが不適切と判断する投稿</Text>
          <Text>ユーザーは、投稿する口コミが事実に基づき、誹謗中傷や不適切な内容を含まないものであることを保証するものとします。</Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第6条（知的財産権）</Text>
          <Text>
            本サービスに関する著作権、特許権、商標権、その他の知的財産権は、当アプリまたは当アプリにライセンスを供与している権利者に帰属します。ユーザーは、当アプリの事前の許可なく、これらの権利を侵害する行為を行ってはなりません。
          </Text>          
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第7条（免責事項）</Text>
          <Text>
            当アプリは、本サービスの利用によって生じた損害について、一切の責任を負いません。ただし、当アプリに故意または重過失がある場合を除きます。
            当アプリは、管理人が検閲および承認を行った口コミに関して、いかなる責任も負いません。ユーザーは、自身の責任において口コミを投稿するものとします。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第8条（サービスの変更・中断・終了）</Text>
          <Text>
            当アプリは、ユーザーへの事前通知なしに、本サービスの内容を変更、追加、中断、または終了することができます。当アプリは、これによりユーザーに生じた損害について、一切の責任を負いません。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第9条（利用規約の変更）</Text>
          <Text>
            当アプリは、本規約を随時変更することができます。変更後の本規約は、当アプリ上に掲示された時点から効力を生じます。
            ユーザーが本規約の変更後も本サービスを利用し続ける場合、変更後の本規約に同意したものとみなします。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>第10条（準拠法および裁判管轄）</Text>
          <Text>
            本規約は、日本法に準拠し、日本法に基づいて解釈されます。本サービスに関して生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>■お問い合わせ■</Text>
          <Text>
            本規約に関するお問い合わせは、
            <Text 
              style={styles.link} 
              onPress={()=>{
                router.push('/others/form')
                onTabPress('form')
              }}
            >
              問い合わせフォーム
            </Text>
            へご連絡ください。
          </Text>
        </View>

        <View style={{padding:64}}/>

      </ScrollView>
    </BackgroundTemplate>
  )
}
const styles = StyleSheet.create({
  outerbox: {
    paddingHorizontal: 16,
    paddingVertical: 40
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  innerBox: {
    padding: 8,
    marginVertical: 8
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
})
