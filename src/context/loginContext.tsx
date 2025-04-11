import { createContext, useState, useEffect } from "react"
import { io } from "socket.io-client"
import Constants from "expo-constants"
import { appleAuth } from '@invertase/react-native-apple-authentication'

import { type userType } from "../types/types"
import createAxiosClient from "@/utils/axiosClient"
import { Alert } from "react-native"
import { router } from "expo-router"
import { type AuthSessionResult } from "expo-auth-session"
import { useTab } from "./tabContext"
import { saveToken, getToken, deleteToken } from "@/utils/secureStore"

const socket = io(Constants.expoConfig?.extra?.API_BASE_URL)

interface AuthContextType {
  isLoggedIn: boolean
  user: userType | null
  setUser: React.Dispatch<React.SetStateAction<null>>
  register: (penName: string, email: string, password: string, setLoading: React.Dispatch<React.SetStateAction<boolean>> )=> Promise<void>
  login: (email: string, password: string) => Promise<void>
  googleLogin: (response: AuthSessionResult | null) => Promise<void>
  appleLogin: () => Promise<void>
  logout: () => Promise<void>
}
const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  register: async () => {},
  login: async () => {},
  googleLogin: async () => {},
  appleLogin: async () => {},
  logout: async () => {}
}
const AuthContext = createContext(defaultAuthContext)

interface ChildrenType {
  children: React.ReactNode
}
const AuthProvider: React.FC<ChildrenType> = ({ children }:ChildrenType) => {
  const { onTabPress } = useTab()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  async function checkLoginStatus () {
    const token = await getToken("accessToken")
    if (!token) {
      setIsLoggedIn(false)
      return
    }
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post("/api/user/validateToken", {
        Authorization: `Bearer ${token}`
      })
      setIsLoggedIn(true)
      setUser(response?.data.user)
    } catch {
      await refreshToken()
    }
  }

  async function refreshToken() {
    const refreshToken = await getToken("refreshToken")
    if (!refreshToken) {
      setIsLoggedIn(false)
      return
    }
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post("/api/user/refreshToken", { refreshToken })
      await saveToken("accessToken", response?.data.accessToken)
      await checkLoginStatus()
    } catch {
      await logout()
    }
  };

  async function register(penName: string, email: string, password: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    try{
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post("/api/user/register", { penName, email, password })
      if(response?.data.success){
        login( email, password )
      } else {
        Alert.alert('登録は完了しましたが、エラーが発生しログインできませんでした')
      }
    } catch {
      Alert.alert('エラーが発生し登録できませんでした')
      setLoading(false)
    }
  }

  async function login( email: string, password: string) {
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post("/api/user/login", { email, password })
      await saveToken("accessToken", response?.data.accessToken)
      await saveToken("refreshToken", response?.data.refreshToken)
      setIsLoggedIn(true)
      setUser(response?.data.user)
      Alert.alert('ログインしました。')
      onTabPress('myPage')
      router.replace('/user/myPage')
    } catch {
      Alert.alert('エラーが発生しログインできませんでした')
    }
  }

  async function googleLogin( response: AuthSessionResult | null){
    if (response?.type === "success"&& response.authentication){
      const axiosClient = await createAxiosClient()
      const res = await axiosClient?.post(
        '/api/user/auth/google', 
        { accessToken: response.authentication.accessToken}
      )
      if(!res){
        Alert.alert('サーバーからのレスポンスがありません')
        return
      }
      await saveToken("accessToken", res.data.accessToken)
      await saveToken("refreshToken", res.data.refreshToken)
      setIsLoggedIn(true)
      setUser(res.data.user)
      Alert.alert('ログインしました。')
      onTabPress('myPage')
      router.replace('/user/myPage')
    } else {
      Alert.alert('googleレスポンスにトークンがありません')
    }
  }

  async function appleLogin() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
      })
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)
      if (credentialState === appleAuth.State.AUTHORIZED) {
        const axiosClient = await createAxiosClient()
        const res = await axiosClient?.post('/api/user/auth/apple', {
          username: appleAuthRequestResponse.fullName,
          email: appleAuthRequestResponse.email,
          appleId: appleAuthRequestResponse.authorizationCode
        })
        await saveToken("accessToken", res?.data.accessToken)
        await saveToken("refreshToken", res?.data.refreshToken)
        setIsLoggedIn(true)
        setUser(res?.data.user)
        Alert.alert('ログインしました。')
        onTabPress('myPage')
        router.replace('/user/myPage')
      } else {
        Alert.alert("Apple認証に失敗しました")
      }
    } catch {
      Alert.alert("Appleログインができませんでした")
    }
  }

  async function logout () {
    await deleteToken("accessToken")
    await deleteToken("refreshToken")
    setIsLoggedIn(false)
    socket.disconnect()
    setUser(null)
    router.replace('/t-home')
    Alert.alert('ログアウトしました。')
  };

  useEffect(() => {
    checkLoginStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, register, login, googleLogin, appleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

