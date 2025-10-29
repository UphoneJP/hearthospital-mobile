import { Button } from "react-native-paper"

interface PropsType {
  title: string
  color: string
  fun?: ()=>void
  styleChange?: object
  disabled?: boolean
}

export default function RaisedButton ({title, color, fun, styleChange, disabled=false}: PropsType) {
  return (
    <Button
      style={{
        borderColor: color
      }}
      mode="outlined"
      labelStyle={{ color: color }}
      contentStyle={styleChange}
      onPress={fun}
      disabled={disabled}
    >
      {title}
    </Button>
  )
}
