import { View } from 'react-native'
import Tab from './Tab'
import { useTab } from '../../context/tabContext'

export default function Tabs() {
  const { selectedTab, onTabPress } = useTab()

  return (
    <View style={{flexDirection: 'row'}}>

      <Tab 
        name='home' 
        title='HOME' 
        select={selectedTab === 'home'}
        onTabPress={onTabPress}
      />

      <Tab 
        name='hospital' 
        title='病院検索' 
        select={selectedTab === 'hospital'}
        onTabPress={onTabPress} 
      />

      <Tab 
        name='data' 
        title='病院データ' 
        select={selectedTab === 'data'}
        onTabPress={onTabPress} 
      />

      <Tab 
        name='talkingRoom' 
        title='おしゃべり場' 
        select={selectedTab === 'talkingRoom'}
        onTabPress={onTabPress} 
      />

    </View>
  )
}

