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
}

export default function CustomInput(prop:PropsType){
  const { label, val, setVal, style, multiline=false, id, sessionName } = prop

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
      activeOutlineColor="orange"
      outlineColor="orange"
      style={style}
      right={<TextInput.Icon icon="check" 
        color={val.trim()===''?'transparent':'orange'}        
      />}
      multiline={multiline}
      theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
    />
  )
}
