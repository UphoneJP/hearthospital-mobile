import { Badge, List } from 'react-native-paper'
import { FontAwesome5 } from '@expo/vector-icons'
import { useContext, useState } from 'react'
import { type contactPersonType } from '@/src/types/types'
import { Text, TouchableOpacity, View } from 'react-native'
import { UnReadMessagesContext } from '@/src/context/messageContext'

interface PropsType {
  contactPersons: contactPersonType[] | undefined
  handlePress: (personId: string)=> void
}
export default function FriendsList (prop: PropsType) {
  const { contactPersons, handlePress } = prop
  const [expanded, setExpanded] = useState<boolean>(true)
  const { unReadMessages } = useContext(UnReadMessagesContext)

  return (
    <List.Section>
      <List.Accordion
        title="コンタクト済み"
        left={()=>
          <FontAwesome5 
            name="user-friends" 
            size={24} 
            style={{alignSelf: 'center'}}
          />
        }
        expanded={expanded}
        style={{paddingHorizontal: 16}}
        onPress={()=>setExpanded(!expanded)}
      >
        {contactPersons?.map(person=>(
          <TouchableOpacity 
            key={person._id} 
            onPress={()=>handlePress(person._id)}
          >
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginVertical: 8}}>
                {person.penName}
              </Text>
              {unReadMessages.filter(message=>message.sender === person._id).length > 0 &&
                <Badge style={{alignSelf: 'center', marginLeft: 8}}>
                  {/* {person.unreadCount} */}
                  { unReadMessages.filter(message=>message.sender === person._id).length }
                </Badge>
              }
              
            </View>
          </TouchableOpacity>
        ))}
      </List.Accordion>
    </List.Section>
  )
}
