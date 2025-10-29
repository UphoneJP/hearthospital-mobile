import { TextInput } from "react-native-paper"
import { MaterialIcons } from '@expo/vector-icons'
import { Fragment, useState } from "react"
import { usersExceptContactPersonsType } from "@/src/types/types"
import { StyleSheet, Text, TouchableOpacity } from "react-native"

interface PropsType {
  usersExceptContactPersons: usersExceptContactPersonsType[]
  handlePress: (personId: string)=> void
}
export default function SearchFriend(prop: PropsType){
  const { usersExceptContactPersons, handlePress } = prop
  const [inputVal, setInputVal] = useState<string>('')

  return (
    <>
      <TextInput
        label='送信宛先を検索'
        mode="outlined"
        autoCapitalize="none"
        left={
          <TextInput.Icon 
            icon={() => (
              <MaterialIcons 
                name="person-search"
                size={36} 
                color="orange"
              />
            )}
          />
        }
        value={inputVal}
        onChangeText={(text)=>setInputVal(text)}
        outlineStyle={{borderColor: 'orange', backgroundColor: 'white'}}
        contentStyle={{color: 'orange' }}
        theme={{ colors: { primary: 'orange', onSurfaceVariant: 'orange' } }}
        right={inputVal.length > 0 ? 
          <TextInput.Icon 
            icon="close" 
            color="orange" 
            onPress={() => setInputVal('')} 
          /> : null
        }
        style={{height: 64}}
      />
      {usersExceptContactPersons
        .map(person=>{
          return(
            <Fragment key={person._id}>
              {inputVal!==''&&person.penName.includes(inputVal)&&
                <TouchableOpacity style={styles.chip} onPress={()=>handlePress(person._id)}>
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
const styles = StyleSheet.create({
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'navy',
    borderRadius: 8,
    marginVertical: 4,
    marginRight: 'auto',
    marginLeft: 16
  }
})
