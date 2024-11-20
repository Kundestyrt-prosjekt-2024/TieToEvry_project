import { View, Text, ActivityIndicator } from "react-native"

const DataLoading = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#0000ff" />
      <Text className="text-lg mt-2">Loading...</Text>
    </View>
  )
}

export default DataLoading
