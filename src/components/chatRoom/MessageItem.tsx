/* eslint-disable react/display-name */
import { messageType } from "@/src/types/types"
import { StyleSheet, Text, View, Linking } from "react-native"
import { memo } from "react"
import AutoLink from "react-native-autolink"

interface PropsType {
  message: messageType
  userId: string | null
}
const MessageItem = memo(({message, userId}:PropsType) => {
  const isSender = message.sender === userId
  return (
    <View style={[
      styles.box, 
      {alignSelf: isSender ? "flex-end" : "flex-start"}
    ]}>

      {/* メッセージ本文 */}
      <AutoLink
        text={message.content}
        onPress={(url) => Linking.openURL(url)}
        linkStyle={styles.link}
        selectable={true}
        style={[
          styles.message,
          {backgroundColor: isSender?"blue":"green"}
        ]}
      />
      {/* <Text selectable={true} style={[
        styles.message,
        {backgroundColor: isSender?"blue":"green"}
      ]}>
        {message.content}
      </Text> */}

      {/* 影 */}
      <AutoLink
        text={message.content}
        onPress={(url) => Linking.openURL(url)}
        linkStyle={styles.link}
        selectable={true}
        style={[
          styles.messageShadow, 
        {left: isSender ? 4 : -4}
        ]}
      />
      {/* <Text style={[ 
        styles.messageShadow, 
        {left: isSender ? 4 : -4}
      ]}>
        {message.content}
      </Text> */}

      {/* 既読と送信日時 */}
      <View style={[
        styles.info,
        {right: isSender?0:"auto", left: isSender?"auto":0 }
      ]}>
        <Text style={styles.infoText}>
          {(isSender && message.shown) && '既読　-　'}
          {new Date(message.timestamp).toLocaleDateString("ja-JP")}
          {isSender ? "送信済み" : "受信"}
        </Text>

        {(!isSender&&!message.shown)&&
          <Text style={styles.infoIcon}>●</Text>
        }
      </View>

    </View>
  )
})
const styles = StyleSheet.create({
  box: {
    maxWidth: 240,
    marginBottom: 32,
    position: 'relative'
  },
  message: {
    color: 'white',
    minWidth: 16,
    padding: 8,
    borderRadius: 8,
    flexShrink: 1,
    zIndex: 2
  },
  messageShadow: {
    backgroundColor: '#666666',
    color: '#666666',
    minWidth: 16,
    padding: 8,
    borderRadius: 8,
    flexShrink: 1,
    position: 'absolute',
    top: 4
  },
  info: {
    position: 'absolute',
    bottom: -20,
    flexDirection: 'row'
  },
  infoText: {
    color: 'gray',
    fontSize: 12
  },
  infoIcon: {
    color: 'orange',
    paddingHorizontal: 4
  },
  link: {
    color: 'yellow',
    textDecorationLine: 'underline'
  }
})

export default MessageItem
