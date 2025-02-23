import { Button } from '@rneui/themed'
import { router } from 'expo-router'

interface CustomButtonProps {
    title: string, 
    color: string,
    url?: string,
    fun?: ()=>void
    style?: object
    disabledFun?: boolean
}
export default function CustomButton ({title, color, url, fun, style, disabledFun}:CustomButtonProps) {
    return (
        <Button
          title={title}
          buttonStyle={{
            backgroundColor: color,
            borderRadius: 30
          }}
          containerStyle={[
            {
              width: 280,
              marginHorizontal: 'auto',
              marginVertical: 12,
              shadowColor: '#000000',
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: {width:0, height:8},
              elevation: 40
            },
            style
          ]}
          titleStyle={{ 
            fontSize: 16,
            paddingBottom: 6
          }}
          onPress={()=>{
            if(url)router.push(url)
            if(fun)fun()
          }}
          disabled={disabledFun}
        />
    )
}
