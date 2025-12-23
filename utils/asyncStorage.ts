import AsyncStorage from '@react-native-async-storage/async-storage'

async function saveData (key: string, value: string) {
  await AsyncStorage.setItem(key, value)
}
async function getData(key: string) {
  return await AsyncStorage.getItem(key)
}
async function deleteData(key: string) {
  await AsyncStorage.removeItem(key)
}

export { saveData, getData, deleteData }
