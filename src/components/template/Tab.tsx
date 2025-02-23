import { TouchableOpacity, StyleSheet, Text } from 'react-native'
import { router } from 'expo-router'
import { Entypo, FontAwesome6, Foundation, Fontisto } from '@expo/vector-icons'
import { useTab } from '../../context/tabContext'

interface Props {
    name: string,
    title: string,
    select: boolean,
    onTabPress: (name: string) => void
    children?: React.ReactNode
}

export default function Tab(prop:Props) {
    const {name, title, select, onTabPress, children} = prop
    const { selectedTab } = useTab()
    const styles = StyleSheet.create({
        tabBox: {
            width: '25%',
            backgroundColor: select?'#fede9d':'orange',
            paddingVertical: 4
        },
        imageStyle: {
            textAlign: 'center'
        },
        textStyle: {
            fontSize: 10,
            color: 'white',
            textAlign: 'center'
        }
    })

    const linkFun = (n: string) => {
        onTabPress(n)
        router.replace(`/t-${name}`)
    }

    return (
        <>
          <TouchableOpacity 
              key={name} 
              style={styles.tabBox}
              onPress={()=>linkFun(name)}    
          >
              {name==='home'&&
                  <Entypo name="home" size={20} color='white' style={styles.imageStyle} />
              }
              {name==='hospital'&&
                  <FontAwesome6 name="hospital" size={20} color='white' style={styles.imageStyle} />
              }
              {name==='data'&&
                  <Foundation name="graph-bar" size={20} color='white' style={styles.imageStyle} />
              }
              {name==='talkingRoom'&&
                  <Fontisto name="coffeescript" size={20} color='white' style={styles.imageStyle} />
              }
              <Text style={styles.textStyle}>{title}</Text>
          </TouchableOpacity>
          {selectedTab !== 'hospital'&& children }
        </>
    )
}
