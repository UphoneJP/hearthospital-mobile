import { createContext, useState, useEffect, useContext } from "react"
import { io } from "socket.io-client"
import Constants from "expo-constants"
// import { appleAuth } from '@invertase/react-native-apple-authentication'
import * as AppleAuthentication from 'expo-apple-authentication'

import { type userType } from "../types/types"
import createAxiosClient from "@/utils/axiosClient"
import { Alert } from "react-native"
import { router } from "expo-router"
import { type AuthSessionResult } from "expo-auth-session"
import { useTab } from "./tabContext"
import { saveToken, getToken, deleteToken } from "@/utils/secureStore"
import { LoadingContext } from "./loadingContext"

const socket = io(Constants.expoConfig?.extra?.API_BASE_URL)

interface AuthContextType {
  isLoggedIn: boolean
  user: userType | null
  setUser: React.Dispatch<React.SetStateAction<null>>
  register: (penName: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  googleLogin: (response: AuthSessionResult | null) => Promise<void>
  appleLogin: (credential: AppleAuthentication.AppleAuthenticationCredential) => Promise<void>
  logout: () => Promise<void>
  backToHome: (str?: string) => Promise<void>
}
const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  register: async () => {},
  login: async () => {},
  googleLogin: async () => {},
  appleLogin: async () => {},
  logout: async () => {},
  backToHome: async () => {}
}
const AuthContext = createContext(defaultAuthContext)

interface ChildrenType {
  children: React.ReactNode
}
const AuthProvider: React.FC<ChildrenType> = ({ children }:ChildrenType) => {
  const { onTabPress } = useTab()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const {setServerLoading} = useContext(LoadingContext)

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

  async function register(penName: string, email: string, password: string) {
    try{
      setServerLoading(true)
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post("/api/user/register", { penName, email, password })
      if(response?.data.success){
        login( email, password )
      } else {
        Alert.alert('登録は完了しましたが、エラーが発生しログインできませんでした')
        setServerLoading(false)
      }
    } catch {
      Alert.alert(
        'エラーが発生し登録できませんでした。',
        '入力に間違いないかご確認後に再度お試しください'
      )
      setServerLoading(false)
    }
  }

  async function login( email: string, password: string) {
    try {
      setServerLoading(true)
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post("/api/user/login", { email, password })
      await saveToken("accessToken", response?.data.accessToken)
      await saveToken("refreshToken", response?.data.refreshToken)
      setIsLoggedIn(true)
      setUser(response?.data.user)
      Alert.alert('ログインしました。')
      onTabPress('myPage')
      router.replace('/user/myPage')
      setServerLoading(false)
    } catch {
      Alert.alert(
        'エラーが発生しログインできませんでした。',
        'もう一度入力に間違いないかご確認後にお試しください')
      setServerLoading(false)
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

  async function appleLogin(credential: AppleAuthentication.AppleAuthenticationCredential) {
    try {
      const axiosClient = await createAxiosClient()
      const response = await axiosClient?.post('/api/user/auth/apple', {
        username: credential.fullName?.familyName + ' ' + credential.fullName?.givenName,
        identityToken: credential.identityToken
      })
      await saveToken("accessToken", response?.data.accessToken)
      await saveToken("refreshToken", response?.data.refreshToken)
      setIsLoggedIn(true)
      setUser(response?.data.user)
      Alert.alert('ログインしました。')
      onTabPress('myPage')
      router.replace('/user/myPage')
    } catch {
      Alert.alert("Appleログインができませんでした")
    }
  }

  async function logout () {
    setServerLoading(true)
    await deleteToken("accessToken")
    await deleteToken("refreshToken")
    setIsLoggedIn(false)
    socket.disconnect()
    setUser(null)
    router.replace('/t-home')
    Alert.alert('ログアウトしました。')
    onTabPress('home')
    setServerLoading(false)
  };

  async function backToHome (str?: string) {
    Alert.alert(str || 'エラーが発生しました。ホーム画面へ戻ります。')
    onTabPress('home')
    setServerLoading(false)
    router.replace('/t-home')
  }

  useEffect(() => {
    checkLoginStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, register, login, googleLogin, appleLogin, logout, backToHome }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }

