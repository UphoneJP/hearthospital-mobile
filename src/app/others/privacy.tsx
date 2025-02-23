import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { useTab } from "@/src/context/tabContext"
import { router } from "expo-router"
import { ScrollView, StyleSheet, View } from "react-native"
import { Text } from "react-native"

export default function privacy(){
  const {onTabPress} = useTab()
  return (
    <BackgroundTemplate>
      <ScrollView style={styles.outerbox}>
        <Text style={styles.title}>プライバシーポリシー</Text>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>1. はじめに</Text>
          <Text>
            HeartHospital（以下「当アプリ」 ）は、ユーザーのプライバシーを尊重し、個人情報を保護するために最善を尽くします。このプライバシーポリシーは、当アプリが収集する情報、情報の使用方法、および情報の共有方法について説明します。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>2. 収集する情報</Text>
          <Text>
            当アプリは、以下の情報を収集する場合があります。
          </Text>
          <Text>・登録情報: ユーザーがアカウントを作成する際に提供する氏名またはペンネーム、メールアドレス、パスワードなどの情報。</Text>
          <Text>・口コミ情報: ユーザーが投稿する病院の口コミ。</Text>
          {/* <Text>・技術情報: ユーザーのデバイス情報、IPアドレス、ブラウザの種類、アクセス日時、閲覧ページなどの技術情報。</Text> */}
          <Text>・Cookieおよび類似技術: ユーザーの設定情報を収集するために使用するCookieおよび類似技術。</Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>3. 情報の使用目的</Text>
          <Text>
              当アプリは、収集した情報を以下の目的で使用します。
          </Text>
          <Text>・アカウントの作成および管理</Text>
          <Text>・口コミの投稿および表示</Text>
          <Text>・サービスの改善および新機能の開発</Text>
          <Text>・ユーザーサポートの提供</Text>
          <Text>・セキュリティ対策および不正行為の防止</Text>
          <Text>・法律および規制の遵守</Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>4. 情報の共有</Text>
          <Text>
              当アプリは、ユーザーの個人情報を以下の場合を除き、第三者と共有しません。
          </Text>
          <Text>・ユーザーの同意がある場合</Text>
          <Text>・法律に基づき開示が求められる場合</Text>
          <Text>・利用規約やプライバシーポリシーの違反に対する対応が必要な場合</Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>5. 情報の保護</Text>
          <Text>
            当アプリは、ユーザーの個人情報を保護するために適切な技術的対策を講じます。ただし、インターネットを通じた情報の送信や保管の完全な安全性を保証することはできません。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>6. 情報の保存期間</Text>
          <Text>
            当アプリは、収集した個人情報を、使用目的を達成するために必要な期間に限り保存します。ただし、法律で別途定められている場合は、その規定に従います。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>7. ユーザーの権利</Text>
          <Text>
            ユーザーは、以下の権利を有します。また、権利を行使する場合は、
            <Text 
              style={styles.link} 
              onPress={()=>{
                router.push('/others/form')
                onTabPress('form')
              }}
            >
              問い合わせフォーム
            </Text>
            にてご連絡ください。
          </Text>
          <Text>・個人情報の修正・更新・削除の要求権</Text>
          <Text>・個人情報の処理に対する異議申立て権</Text>
        </View>

        <View style={styles.innerBox}>
          <Text style={styles.subTitle}>8. プライバシーポリシーの変更</Text>
          <Text>
            当アプリは、プライバシーポリシーを随時変更することがあります。変更があった場合は、当アプリ上に掲載します。変更後のプライバシーポリシーは、当アプリに掲載された時点から効力を持ちます。
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
