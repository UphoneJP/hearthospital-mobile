import { UnReadMessagesContext } from "@/src/context/messageContext"
import { type messageType } from "@/src/types/types"
import { useContext, useEffect, useRef, useCallback } from "react"
import { FlatList, type ViewToken } from "react-native"
import MessageItem from "./MessageItem"

interface PropsType {
  userId: string | null
  personId: string | null
}
export default function Messsages({ userId, personId }: PropsType){
  const { messages, markAsReadIO } = useContext(UnReadMessagesContext)
  const flatListRef = useRef<FlatList<messageType> | null>(null)

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: messages.length - 1,
          animated: true
        })
      }, 500)
    } 
  }, [messages])

  // 既読処理
  const onViewableItemsChanged = useCallback(
    ({viewableItems}:{viewableItems:ViewToken[]}) => {
      viewableItems.forEach((item) => {
        const message = item.item as messageType
        if ( message.sender !== userId && !message.shown && personId && userId) {
          markAsReadIO(userId, personId, message._id)
        }
      })
    }
  , [markAsReadIO, userId, personId])

  const renderItem = useCallback(
    ({ item: message }: { item: messageType }) => (
      <MessageItem message={message} userId={userId} />
    ),
    [userId]
  )

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item._id.toString()}
      style={{width: '100%', padding: 16}}
      renderItem={renderItem}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      contentContainerStyle={{ paddingBottom: 160 }}
      onEndReachedThreshold={0.2}
      getItemLayout={(_, index) => ({ length: 60, offset: 60 * index, index })} // 各アイテムの高さを固定
    />
  )
}
