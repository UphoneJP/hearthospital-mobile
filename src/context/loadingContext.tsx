import { createContext, useState } from "react"

interface LoadingContextType {
  serverLoading: boolean,
  setServerLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const defaultLoadingContext:LoadingContextType = {
  serverLoading: false,
  setServerLoading: () => {}
}

const LoadingContext = createContext(defaultLoadingContext)

const LoadingProvider = ({children}:{children: React.ReactNode}) => {
  const [serverLoading, setServerLoading] = useState<boolean>(false)
  
  return (
    <LoadingContext.Provider value={{serverLoading, setServerLoading}}>
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, LoadingContext }
