import { TextInput } from "react-native-paper"

interface PropsType {
  label: string
  val: string
  setVal: (value: React.SetStateAction<string>) => void
  style?: object
  multiline?: boolean
}

export default function CustomInput(prop:PropsType){
  const { label, val, setVal, style, multiline=false } = prop

  return (
    <TextInput
      label={label}
      mode="outlined"
      value={val}
      onChangeText={text => setVal(text)}
      autoCapitalize="none"
      activeOutlineColor="green"
      outlineColor={val?"green":"gray"}
      style={style}
      right={<TextInput.Icon icon="check" 
        color={val.trim()===''?'transparent':'green'}        
      />}
      multiline={multiline}
    />
  )
}
