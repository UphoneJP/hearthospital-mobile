/* eslint-disable @typescript-eslint/no-require-imports */
import { Divider } from "react-native-paper"
import { useState } from "react"
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Entypo } from '@expo/vector-icons'

interface PropsType {
  date: string
  title: string
  content: string
  backImageNum: number
  textColor: string
}
export default function Topic (prop: PropsType) {
  const { date, title, content, backImageNum, textColor} = prop
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <TouchableOpacity
        style={{width: '50%', aspectRatio: 1}}
        onPress={()=>setIsOpen(prev=>!prev)}
      >
        <ImageBackground
          source={colorAssets[backImageNum]}
          style={styles.background}
        >
          <Text style={[styles.dateStyle, {color: textColor}]}>
            {date}
          </Text>

          <Divider />
          
          <View style={styles.titleBox}>
            <Text style={[styles.title, {color: textColor}]}>{title}</Text>
          </View>

          {isOpen ? 
            <Entypo name="chevron-thin-up" size={24} color="orange" style={{textAlign: 'center'}} />
            : <Entypo name="chevron-thin-down" size={24} color={textColor} style={{textAlign: 'center'}} />
          }
        
        </ImageBackground>
      </TouchableOpacity>

      {isOpen && (
        <View>
          <TouchableOpacity
            style={{width: '100%', aspectRatio: 1}}
            onPress={()=>setIsOpen(prev=>!prev)}
          >
            <View style={styles.dialogBackground}>
              <View style={{flexDirection: 'row', paddingBottom: 0, paddingRight: 16}}>
                <View style={{flex: 1}}>
                  <Text style={[styles.dateStyle, {color: textColor}]}>
                    {date}
                  </Text>
                  <Text style={[styles.title, {color: textColor}]}>
                    {title}
                  </Text>
                </View>
                <Image source={heartonAssets[backImageNum]} style={styles.hearton}/>
              </View>
              
              <Divider/>
              
              <View style={{flex: 1}}>
                <Text style={{marginHorizontal: 16}}>
                  {content}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>
      )}
    </>
  )
}
const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  dateStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    paddingTop: 16
  },
  titleBox: { 
    flex: 1, 
    justifyContent: 'center',
    paddingBottom: 16
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 8
  },
  dialogBackground: {
    margin: 16,
    flex: 1,
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: 'orange',
    backgroundColor: 'white'
  },
  hearton: {
    width: 80, 
    height: 120, 
    objectFit: 'contain',
    marginBottom: -16
  }
})
const colorAssets = [
  require('@/assets/colors/blue.jpg'),
  require('@/assets/colors/pink.jpg'),
  require('@/assets/colors/green.jpg'),
  require('@/assets/colors/yellow.jpg'),
  require('@/assets/colors/blue2.jpg'),
  require('@/assets/colors/pink2.jpg'),
  require('@/assets/colors/green2.jpg'),
  require('@/assets/colors/yellow2.jpg'),
  require('@/assets/colors/blue3.jpg'),
  require('@/assets/colors/pink3.jpg'),
  require('@/assets/colors/green3.jpg'),
  require('@/assets/colors/yellow3.jpg')
]
const heartonAssets = [
  require('@/assets/hearton-heart.png'),
  require('@/assets/hearton-jogging.png'),
  require('@/assets/hearton-holding.png'),
  require('@/assets/hearton-singing.png'),
  require('@/assets/heartonOnly.png')
]

