import { Icon, Input } from "@rneui/themed"
import { MaterialIcons } from '@expo/vector-icons'
import { Fragment, useState } from "react"
import { usersExceptContactPersonsType } from "@/src/types/types"
import { Text, TouchableOpacity } from "react-native"

interface PropsType {
  usersExceptContactPersons: usersExceptContactPersonsType[]
  handlePress: (personId: string)=> void
}
export default function SearchFriend(prop: PropsType){
  const { usersExceptContactPersons, handlePress } = prop
  const [inputVal, setInputVal] = useState<string>('')

  return (
    <>
      <Input
        placeholder='送信宛先を検索'
        leftIcon={
          <MaterialIcons 
            name="person-search"
            size={24} 
            style={{alignSelf: 'center'}}
          />
        }
        value={inputVal}
        onChangeText={(text)=>setInputVal(text)}
        containerStyle={{height:52,marginTop: 16}}
        rightIcon={
          <Icon
            type="MaterialIcons"
            name="clear"
            onPress={() => setInputVal('')}
            color={inputVal ? 'gray' : 'transparent'}
          />
        }
      />
      {usersExceptContactPersons
        .map(person=>{
          return(
            <Fragment key={person._id}>
              {inputVal!==''&&person.penName.includes(inputVal)&&
                <TouchableOpacity onPress={()=>handlePress(person._id)}>
                  <Text>{person.penName}</Text>
                </TouchableOpacity>
              }
            </Fragment>
          )
        })
      }
    </>
  )
}
