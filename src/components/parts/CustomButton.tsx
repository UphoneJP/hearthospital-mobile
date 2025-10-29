import { Button } from 'react-native-paper'
import { router } from 'expo-router'

interface CustomButtonProps {
  title: string, 
  color: string,
  url?: string,
  fun?: ()=>void
  style?: object
  disabledFun?: boolean
}
export default function CustomButton (props:CustomButtonProps) {
  const { title, color, url, fun, style, disabledFun } = props
  return (
    <Button
      style={{
        marginVertical: 12
      }}
      contentStyle={[
        {
          backgroundColor: color,
          width: 280,
          marginHorizontal: 'auto',
          paddingVertical: 8,
          borderRadius: 64
        },
        style
      ]}
      labelStyle={{ 
        fontSize: 16,
        paddingBottom: 4,
        color: '#ffffff'
      }}
      onPress={()=>{
        if(url)router.push(url)
        if(fun)fun()
      }}
      disabled={disabledFun}
    >
      {title}
    </Button>
  )
}
