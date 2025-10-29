import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from "expo-router"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/loginContext"
import CustomDialog from "./CustomDialog"

interface PropsType {
  color?: string
  text?: string
  url?: string
  setInputVisible?: React.Dispatch<React.SetStateAction<boolean>> | undefined
  addButtonVisible: boolean
  setAddButtonVisible: React.Dispatch<React.SetStateAction<boolean>>
}
export default function AddButton(prop: PropsType) {
  const {color='orange', text='コメントする', url, setInputVisible, addButtonVisible, setAddButtonVisible} = prop
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const {isLoggedIn} = useContext(AuthContext)

  function handlePress () {
    if(isLoggedIn){
      // ログインしている場合はリンクかtextbox表示
      if(url) router.push(url)
      if(setInputVisible) {
        setAddButtonVisible(false)
        setInputVisible(true)
      }
    } else {
      // ログインしていない場合はログインを促すダイアログ表示
      setDialogVisible(true)
      setAddButtonVisible(false)
    }
  }

  return (
    <>
      {addButtonVisible&&(
        <TouchableOpacity style={styles.addComment} onPress={handlePress}>
          <Text style={[styles.text, {color: color}]}>{text}</Text>
          <MaterialCommunityIcons name="comment-plus" size={48} color={color} />
        </TouchableOpacity>
      )}

      {/* ログインしていない場合のダイアログボックス */}
      <CustomDialog
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        setAddButtonVisible={setAddButtonVisible}
      />
    </>
  )
}
const styles = StyleSheet.create({
  addComment: {
    position: 'absolute', 
    bottom: 32, 
    right: 24,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10
  },
  text: {
    fontSize: 8, 
    marginBottom: -4
  }
})

