import { StyleSheet, Text } from "react-native"
import MenuItem from "./MenuItem"
import { useTab } from "@/src/context/tabContext"
import { Entypo, FontAwesome6, Foundation, Fontisto } from '@expo/vector-icons'

interface PropsType {
  toggleMenu: () => void
}
export default function MenuMain({toggleMenu}:PropsType){
  const { selectedTab } = useTab()
  return(
    <>
      <Text style={styles.subTitle}>main</Text>

      <MenuItem
        icon={<Entypo name="home" size={20} color={selectedTab === "home"? 'white': '#444444'}/>}
        label="Home"
        name="home"
        url="/t-home"
        toggleMenu={toggleMenu}
      />
      <MenuItem
        icon={<FontAwesome6 name="hospital" size={20} color={selectedTab === "hospital"? 'white': '#444444'}/>}
        label="病院検索"
        name="hospital"
        url="/t-hospital"
        toggleMenu={toggleMenu}
      />
      <MenuItem
        icon={<Foundation name="graph-bar" size={20} color={selectedTab === "data"? 'white': '#444444'}/>}
        label="病院指標"
        name="data"
        url="/t-data"
        toggleMenu={toggleMenu}
      />
      <MenuItem
        icon={<Fontisto name="coffeescript" size={20} color={selectedTab === "talkingRoom"? 'white': '#444444'}/>}
        label="おしゃべり場"
        name="talkingRoom"
        url="/t-talkingRoom"
        toggleMenu={toggleMenu}
      />
    </>
  )
}
const styles = StyleSheet.create({
  subTitle: {
    color: 'gray'
  }
})
