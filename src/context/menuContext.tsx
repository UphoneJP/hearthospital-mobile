import { createContext, useState } from "react"

interface MenuContextType {
  menuVisible: boolean,
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>
  toggleMenu: () => void
}
const defaultMenuContext:MenuContextType = {
  menuVisible: false,
  setMenuVisible: () => {},
  toggleMenu: () => {}
}
const MenuContext = createContext(defaultMenuContext)


const MenuProvider = ({children}:{children: React.ReactNode}) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false)
  function toggleMenu() {setMenuVisible(!menuVisible)}
  return (
    <MenuContext.Provider value={{menuVisible, setMenuVisible, toggleMenu}}>
      {children}
    </MenuContext.Provider>
  )
}

export { MenuProvider, MenuContext }
