import * as SecureStore from "expo-secure-store"

async function saveToken (key: string, value: string) {
  await SecureStore.setItemAsync(key, value)
}
async function getToken(key: string) {
  return await SecureStore.getItemAsync(key)
}
async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key)
}

export { saveToken, getToken, deleteToken }
