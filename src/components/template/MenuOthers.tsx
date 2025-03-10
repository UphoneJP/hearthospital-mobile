import { StyleSheet, Text } from "react-native"
import MenuItem from "./MenuItem"
import { useTab } from "@/src/context/tabContext"
import { Entypo, MaterialIcons, AntDesign} from '@expo/vector-icons'

interface PropsType {
  toggleMenu: () => void
}
export default function MenuOthers({toggleMenu}:PropsType){
  const { selectedTab } = useTab()
  return(
    <>
      <Text style={styles.subTitle}>others</Text>

      <MenuItem
        icon={<AntDesign name="notification" size={20} color={selectedTab === "news"? 'white': '#444444'}/>}
        label="お知らせ"
        name="news"
        url='/others/news'
        toggleMenu={toggleMenu}
      />
      <MenuItem
        icon={<AntDesign name="form" size={20} color={selectedTab === "form"? 'white': '#444444'}/>}
        label="お問い合わせ"
        name="form"
        url="/others/form"
        toggleMenu={toggleMenu}
      />
      <MenuItem
        icon={<MaterialIcons name="feedback" size={20} color={selectedTab === "feedback"? 'white': '#444444'}/>}
        label="フィードバック"
        name="feedback"
        url="/others/feedback"
        toggleMenu={toggleMenu}
      />
      <MenuItem
        icon={<MaterialIcons name="policy" size={20} color={selectedTab === "policy"? 'white': '#444444'}/>}
        label="利用規約"
        url="https://www.hearthospital.jp/policy"
        toggleMenu={toggleMenu}
        externalIcon={true}
      />
      <MenuItem
        icon={<MaterialIcons name="privacy-tip" size={20} color={selectedTab === "privacy"? 'white': '#444444'}/>}
        label="プライバシーポリシー"
        url="https://www.hearthospital.jp/policy#privacyPolicy"
        toggleMenu={toggleMenu}
        externalIcon={true}
      />
      <MenuItem
        icon={<Entypo name="browser" size={20} color="#444444"/>}
        label="ブラウザ版を開く"
        url='https://www.hearthospital.jp'
        toggleMenu={toggleMenu}
        externalIcon={true}
      />
    </>
  )
}
const styles = StyleSheet.create({
  subTitle: {
    color: 'gray'
  }
})
