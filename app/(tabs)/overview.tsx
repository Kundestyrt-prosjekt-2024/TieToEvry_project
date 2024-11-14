import { View, Text, FlatList, Image, Pressable, Modal, TextInput } from "react-native"
import AppHeader from "@/components/AppHeader"
import { SafeAreaView } from "react-native-safe-area-context"
import { useGetBankAccount, useGetChildren, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/DataLoading"
import { useState } from "react"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { setSpendingLimit } from "@/backend/src/bankAccountDAO"

const Overview = () => {
  const router = useRouter()

  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [spendingLimitInput, setSpendingLimitInput] = useState("")
  const [timeLimit, setTimeLimit] = useState("")

  const selectedChildID = parent.data?.children?.[selectedChildIndex]

  const childBankAccount = useGetBankAccount(selectedChildID || "")

  const spendingLimit =
    childBankAccount.data &&
    childBankAccount.data.spending_limit &&
    childBankAccount.data.spending_limit !== Number.MAX_SAFE_INTEGER
      ? childBankAccount.data.spending_limit.toString()
      : "0"

  const handleChangeSpendingLimit = async () => {
    const translate = { daglig: "daily", ukentlig: "weekly", månedlig: "monthly" }
    const translatedTimeLimit = translate[timeLimit.toLowerCase() as keyof typeof translate]
    await setSpendingLimit(selectedChildID || "", parseInt(spendingLimitInput), translatedTimeLimit)
    childBankAccount.refetch()
    setShowModal(false)
    setSpendingLimitInput("")
    setTimeLimit("")
  }

  if (children.some((query) => query.isPending)) {
    return <DataLoading />
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      <View className="flex items-center mt-6">
        <FlatList
          scrollEnabled={true}
          horizontal={true}
          data={[...children.map((child) => child.data), { isSpecialItem: true, name: "dummyText" }]}
          renderItem={({ item, index }) => {
            if (!item) return null
            if ("isSpecialItem" in item) {
              return (
                <Pressable
                  className="flex items-center justify-center mb-8 ml-4 w-16"
                  onPress={() => router.push("/signupChild")}
                >
                  <Ionicons name="add" size={50} color="#3b82f6" />
                </Pressable>
              )
            } else {
              const isSelected = selectedChildIndex === index
              return (
                <Pressable
                  className="flex flex-col items-center justify-center gap-4"
                  onPress={() => setSelectedChildIndex(index)}
                >
                  <View
                    className={`rounded-full h-20 w-20 justify-center items-center overflow-hidden ${isSelected ? "border-4 border-blue-500" : ""}`}
                  >
                    <Image
                      source={{ uri: item.profilePicture }}
                      className="w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />
                  </View>
                  <Text>{item.name}</Text>
                </Pressable>
              )
            }
          }}
          keyExtractor={(item) => item?.name || ""}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-8" />}
        />
      </View>
      <View className="flex flex-col items-center justify-center mt-10">
        <Text className="font-semibold text-2xl">Saldo: {childBankAccount.data?.balance},-</Text>
        <Pressable
          className="py-3 px-10 bg-blue-300 rounded-md mt-6"
          onPress={() => router.push(`/Transactions?userID=${selectedChildID}`)}
        >
          <Text className="text-lg">Se transaksjoner</Text>
        </Pressable>
      </View>
      <View className="flex flex-row mt-20 pl-8 items-center">
        {spendingLimit === "0" || spendingLimit === Number.MAX_SAFE_INTEGER.toString() ? (
          <>
            <Text>{children[selectedChildIndex]?.data?.name.split(" ")[0]} har ingen beløpsgrense</Text>
            <Pressable className="py-3 px-5 bg-green-300 rounded-lg mr-auto ml-6" onPress={() => setShowModal(true)}>
              <Text>Konfigurer</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text>
              {children[selectedChildIndex].data?.name.split(" ")[0]}'s beløpsgrense: {spendingLimit},-
            </Text>
            <Pressable className="py-3 px-5 bg-green-300 rounded-lg mr-auto ml-6" onPress={() => setShowModal(true)}>
              <Text>Endre</Text>
            </Pressable>
          </>
        )}
      </View>
      <Modal transparent={true} visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable className="flex-1 justify-center items-center bg-opacity-50" onPress={() => setShowModal(false)}>
          <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg" onPress={() => setShowModal(true)}>
            <Text className="text-lg font-bold mb-4">Sett beløpsgrense</Text>
            <TextInput
              className="border p-3 mb-4 rounded-md"
              placeholder="Beløpsgrense (f.eks. 1000)"
              keyboardType="numeric"
              value={spendingLimitInput}
              onChangeText={setSpendingLimitInput}
            />
            <TextInput
              className="border p-3 mb-4 rounded-md"
              placeholder="Tidsbegrensning (daglig, ukentlig, månedlig)"
              value={timeLimit}
              onChangeText={setTimeLimit}
            />
            <Pressable className="p-3 bg-blue-500 rounded-lg mt-4" onPress={handleChangeSpendingLimit}>
              <Text className="text-white text-center">Lagre</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  )
}

export default Overview
