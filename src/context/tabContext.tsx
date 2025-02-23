import { createContext, useContext, useState } from 'react'

interface TabContextType {
    selectedTab: string;
    onTabPress: (name: string) => void
}
const TabContext = createContext<TabContextType | undefined>(undefined)

interface ChildrenType {
    children: React.ReactNode
}
export const TabProvider: React.FC<ChildrenType> = ({ children }: ChildrenType) => {
    const [selectedTab, setSelectedTab] = useState('home')
    const onTabPress = (name: string) => {
        setSelectedTab(name)
    }
    return (
        <TabContext.Provider value={{ selectedTab, onTabPress }}>
            {children}
        </TabContext.Provider>
    )
}

export const useTab = () => {
    const context = useContext(TabContext)
    if (!context) {
        throw new Error('useTab must be used within a TabProvider')
    }
    return context
}
