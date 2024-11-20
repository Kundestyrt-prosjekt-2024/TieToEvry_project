import { View, Text } from "react-native"

const DataError = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-lg text-red-500">Oops! Something went wrong.</Text>
      <Text className="text-base mt-2 text-gray-500">Please try again later.</Text>
    </View>
  )
}

export default DataError
