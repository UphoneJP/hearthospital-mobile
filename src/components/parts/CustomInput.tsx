import { TextInput } from "react-native-paper"
import { saveToken } from "@/utils/secureStore"

interface PropsType {
  label: string
  val: string
  setVal: (value: React.SetStateAction<string>) => void
  style?: object
  multiline?: boolean
  id?: string
  sessionName: string
  placeholder?: string
}

export default function CustomInput(prop:PropsType){
  const { label, val, setVal, style, multiline=false, id, sessionName, placeholder } = prop

  return (
    <TextInput
      label={label}
      mode="outlined"
      value={val}
      onChangeText={async(text) => {
        setVal(text)
        if(id){
          await saveToken(`${id}-${sessionName}`, text)
        } else {
          await saveToken(`${sessionName}`, text)
        }
      }}
      autoCapitalize="none"
      activeOutlineColor="green"
      outlineColor={val?"green":"gray"}
      style={style}
      right={<TextInput.Icon icon="check" 
        color={val.trim()===''?'transparent':'green'}        
      />}
      multiline={multiline}
      placeholder={placeholder ? placeholder : ""}
    />
  )
}
