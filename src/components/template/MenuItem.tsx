import { router } from "expo-router"
import { useContext } from "react"
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Badge } from 'react-native-paper'
import { Feather } from '@expo/vector-icons'
import { AuthContext } from "@/src/context/loginContext"
import { useTab } from "@/src/context/tabContext"

interface PropsType {
  icon: JSX.Element
  label: string
  name?: string
  url: string
  toggleMenu: () => void
  unReadCount?: number
  externalIcon?: boolean
  fun?: () => void
}
export default function MenuItem(prop: PropsType){
  const { icon, label, name, url, toggleMenu, unReadCount, externalIcon, fun } = prop
  const { selectedTab, onTabPress } = useTab()
  const { logout } = useContext(AuthContext)

  const styles = StyleSheet.create({
    itemBox: {
      flexDirection:'row',
      backgroundColor: selectedTab === name? 'orange': 'white',
      borderRadius: 32,
      marginHorizontal: 4
    },
    icon: {
      width: 48,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      fontSize:16,
      paddingTop: 6,
      paddingBottom: 10,
      color: selectedTab === name? 'white': '#444444'
    },
    badge: {
      alignSelf: 'center',
      marginLeft: 4
    }
  })

  function handlePress(){
    if(fun) {
      fun()
      toggleMenu()
    } else {
      if(name){
        onTabPress(name !== "logout" ? name : "home")
        toggleMenu()
        if(name === "logout") logout()
        router.push(url)
      } else {
        Linking.openURL(url)
      }
    }
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.itemBox}>
        <View style={styles.icon}>
          {icon}
        </View>
        
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.text}>
            {label}
          </Text>
          {unReadCount !== undefined && unReadCount > 0 && (
            <Badge style={styles.badge}>{unReadCount}</Badge>
          )}
        </View>

        {externalIcon&&
          <Feather 
            name="external-link" 
            size={16} 
            color='#444444' 
            style={{alignSelf: 'center', marginLeft: 8}} 
          />
        }

      </View>
    </TouchableOpacity>
  )
}
