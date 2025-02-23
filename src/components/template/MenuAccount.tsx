import { StyleSheet, Text } from "react-native"
import MenuItem from "./MenuItem"
import { useTab } from "@/src/context/tabContext"
import { Entypo, MaterialCommunityIcons, SimpleLineIcons, FontAwesome5 } from '@expo/vector-icons'
import { useContext } from "react"
import { AuthContext } from "@/src/context/loginContext"
import { UnReadMessagesContext } from "@/src/context/messageContext"

interface PropsType {
  toggleMenu: () => void
}
export default function MenuAccount({toggleMenu}:PropsType){
  const { selectedTab } = useTab()
  const { isLoggedIn } = useContext(AuthContext)
  const { unReadMessages } = useContext(UnReadMessagesContext)

  return(
    <>
      <Text style={styles.subTitle}>account</Text>
      {isLoggedIn? (
        <>
          <MenuItem
            icon={<MaterialCommunityIcons name="account" size={20} color={selectedTab === "myPage"? 'white': '#444444'}/>}
            label="マイページ"
            name="myPage"
            url="/user/myPage"
            toggleMenu={toggleMenu}
          />
          <MenuItem
            icon={<FontAwesome5 name="rocketchat" size={20} color={selectedTab === "chat"? 'white': '#444444'}/>}
            label="メッセージBOX"
            name="chat"
            url="/user/chat"
            toggleMenu={toggleMenu}
            unReadCount={unReadMessages.length}
          />
          <MenuItem
            icon={<SimpleLineIcons name="logout" size={20} color={selectedTab === "logout"? 'white': '#444444'}/>}
            label="ログアウト"
            name="logout"
            url="/t-home"
            toggleMenu={toggleMenu}
          />
        </>
      ):(
        <>
          <MenuItem
            icon={<Entypo name="login" size={20} color={selectedTab === "login"? 'white': '#444444'}/>}
            label="ログイン"
            name="login"
            url="/user/login"
            toggleMenu={toggleMenu}
          />
          <MenuItem
            icon={<MaterialCommunityIcons name="account-plus" size={20} color={selectedTab === "register"? 'white': '#444444'}/>}
            label="新規ユーザー登録"
            name="register"
            url="/user/register"
            toggleMenu={toggleMenu}
          />
        </>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  subTitle: {
    color: 'gray'
  }
})
