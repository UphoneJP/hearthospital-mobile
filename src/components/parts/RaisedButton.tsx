import { Button } from "@rneui/themed"

interface PropsType {
  title: string | JSX.Element
  color: string
  fun?: ()=>void
  styleChange?: object
  disabled?: boolean
}

export default function RaisedButton ({title, color, fun, styleChange, disabled=false}: PropsType) {
  return (
    <Button
      title={title}
      buttonStyle={{
        borderColor: color
      }}
      type="outline"
      raised
      titleStyle={{ color: color }}
      containerStyle={styleChange}
      onPress={fun}
      disabled={disabled}
    />
  )
}
