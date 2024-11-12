import React from "react"
import { View, Text, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"

interface Props {
  text: string
  href?: string
  classname?: string
  onClick: () => void
  style?: any
}

// href is optional as the button can work as a general button that does something onClick, or
// can work as a routing button for when we want to navigate.
const Button: React.FC<Props> = ({ text, href, classname, onClick, style }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    if (href) {
      navigation.navigate(href as never)
    } else {
      onClick()
    }
  }
  return (
    <Pressable style={style} onPress={handlePress}>
      <View className={`bg-red-200 rounded-2xl inline-block self-center py-2 px-4 ${classname}`}>
        <Text className="text-center text-base font-normal">{text}</Text>
      </View>
    </Pressable>
  )
}

export default Button
