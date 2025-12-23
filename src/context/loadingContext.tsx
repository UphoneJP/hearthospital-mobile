import { createContext, useState } from "react"

interface LoadingContextType {
  serverLoading: boolean,
  setServerLoading: React.Dispatch<React.SetStateAction<boolean>>,
  loadingPercentage: number,
  setLoadingPercentage: React.Dispatch<React.SetStateAction<number>>
}
const defaultLoadingContext:LoadingContextType = {
  serverLoading: false,
  setServerLoading: () => {},
  loadingPercentage: 0,
  setLoadingPercentage: () => {}
}
const LoadingContext = createContext(defaultLoadingContext)

const LoadingProvider = ({children}:{children: React.ReactNode}) => {
  const [serverLoading, setServerLoading] = useState<boolean>(false)
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0)
  
  return (
    <LoadingContext.Provider value={{serverLoading, setServerLoading, loadingPercentage, setLoadingPercentage}}>
      {children}
    </LoadingContext.Provider>
  )
}

export { LoadingProvider, LoadingContext }
