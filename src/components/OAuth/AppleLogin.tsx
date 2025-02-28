import { useContext } from 'react'
import { View } from 'react-native'
import { AppleButton } from '@invertase/react-native-apple-authentication'
import { AuthContext } from '@/src/context/loginContext'

export default function AppleLogin() {
  const { appleLogin } = useContext(AuthContext)

  return (
    <View>
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE_OUTLINE}
        buttonType={AppleButton.Type.SIGN_IN}
        onPress={appleLogin}
      />
    </View>
  )
}
