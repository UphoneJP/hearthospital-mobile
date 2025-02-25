import BackgroundTemplate from "@/src/components/template/BackgroundTemplete"
import { useTab } from "@/src/context/tabContext"
import { router } from "expo-router"
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "react-native"

export default function privacy(){
  const {onTabPress} = useTab()
  return (
    <BackgroundTemplate>
      <ScrollView style={styles.outerbox}>
        <Text selectable={true} style={styles.title}>プライバシーポリシー</Text>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>1. はじめに</Text>
          <Text selectable={true}>
            HeartHospital（以下「当アプリ」 ）は、ユーザーのプライバシーを尊重し、個人情報を保護するために最善を尽くします。このプライバシーポリシーは、当アプリが収集する情報、情報の使用方法、および情報の共有方法について説明します。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>2. 収集する情報</Text>
          <Text selectable={true}>
            (1) 当アプリは、以下の情報を収集する場合があります。
          </Text>
          <Text selectable={true}>・登録情報: ユーザーがアカウントを登録する際に提供するペンネーム、メールアドレス、パスワードの情報。</Text>
          <Text selectable={true}>・外部アカウント登録情報: 外部アカウント内のID、氏名、メールアドレスの情報(外部アカウントを利用して当アプリのアカウント登録をした場合に限る)。</Text>
          <Text selectable={true}>・口コミ情報: ユーザーが投稿する病院の情報や子育てに関する情報とその投稿日時。</Text>
          <Text selectable={true}>・技術情報: IPアドレス(不正アクセス時に限る)などの技術情報。</Text>
          <Text selectable={true}>
            (2) 当アプリ(モバイルアプリに限る)では Google AdMob を使用して広告を配信しており、パーソナライズド広告を使用しない設定にしています。ユーザーの興味関心・履歴等に関する情報収集は一切行われません。ただし、Googleは広告の表示回数やクリック数などの統計情報を収集し、広告の最適化や不正防止のために利用することがあります。詳しくはGoogleのプライバシーポリシーをご確認ください。
          </Text>
          <TouchableOpacity onPress={()=>{Linking.openURL('https://policies.google.com/privacy')}}>
            <Text style={styles.link}>Google プライバシーポリシー</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Linking.openURL('https://policies.google.com/technologies/ads')}}>
            <Text style={styles.link}>Google 広告に関するポリシー</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Linking.openURL('https://support.google.com/admob/answer/7665968')}}>
            <Text style={styles.link}>Google データの使用に関するポリシー</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>3. 情報の使用目的</Text>
          <Text selectable={true}>
              当アプリは、収集した情報を以下の目的で使用します。
          </Text>
          <Text selectable={true}>・アカウントの作成および管理</Text>
          <Text selectable={true}>・口コミの投稿および表示</Text>
          <Text selectable={true}>・サービスの改善および新機能の開発</Text>
          <Text selectable={true}>・ユーザーサポートの提供</Text>
          <Text selectable={true}>・セキュリティ対策および不正行為の防止</Text>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>4. 情報の共有</Text>
          <Text selectable={true}>
              当アプリは、ユーザーの個人情報を以下の場合を除き、第三者と共有しません。
          </Text>
          <Text selectable={true}>・ユーザーの同意がある場合</Text>
          <Text selectable={true}>・法律に基づき開示が求められる場合</Text>
          <Text selectable={true}>・利用規約やプライバシーポリシーの違反に対する対応が必要な場合</Text>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>5. 情報の保護</Text>
          <Text selectable={true}>
            当アプリは、ユーザーの個人情報を保護するために適切な技術的対策を講じます。ただし、インターネットを通じた情報の送信や保管の完全な安全性を保証することはできません。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>6. 情報の保存期間</Text>
          <Text selectable={true}>
            当アプリは、収集した個人情報を、使用目的を達成するために必要な期間に限り保存します。ただし、法律で別途定められている場合は、その規定に従います。
          </Text>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>7. ユーザーの権利</Text>
          <Text selectable={true}>
            ユーザーは、以下の権利を有します。また、権利を行使する場合は、
            <Text selectable={true} 
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
          <Text selectable={true}>・個人情報の修正・更新・削除の要求権</Text>
          <Text selectable={true}>・個人情報の処理に対する異議申立て権</Text>
        </View>

        <View style={styles.innerBox}>
          <Text selectable={true} style={styles.subTitle}>8. プライバシーポリシーの変更</Text>
          <Text selectable={true}>
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
