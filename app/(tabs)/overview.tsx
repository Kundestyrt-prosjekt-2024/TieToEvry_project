import { View, Text, FlatList, Image, Pressable, Modal, TextInput } from "react-native"
import AppHeader from "@/components/ui/AppHeader"
import { SafeAreaView } from "react-native-safe-area-context"
import { useGetBankAccount, useGetChildren, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/ui/DataLoading"
import { useState } from "react"
import { useRouter } from "expo-router"
import AntDesign from "@expo/vector-icons/AntDesign"
import { setSpendingLimit, setSpendingLimitPerPurchase } from "@/backend/src/bankAccountDAO"

const Overview = () => {
  const router = useRouter()

  const parentID = useGetUserID()
  const parent = useGetUser(parentID.data || "")
  const children = useGetChildren(parent.data?.children || [])

  const [selectedChildIndex, setSelectedChildIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)
  const [spendingLimitPerPurchaseInput, setSpendingLimitPerPurchaseInput] = useState("")
  const [spendingLimitInput, setSpendingLimitInput] = useState("")
  const [timeLimit, setTimeLimit] = useState<"daily" | "weekly" | "monthly">("daily")

  const selectedChildID = parent.data?.children?.[selectedChildIndex]
  const childBankAccount = useGetBankAccount(selectedChildID || "")

  const spendingLimit =
    childBankAccount.data &&
    childBankAccount.data.spending_limit &&
    childBankAccount.data.spending_limit !== Number.MAX_SAFE_INTEGER
      ? childBankAccount.data.spending_limit.toString()
      : "0"

  const spendingLimitPerPurchase =
    childBankAccount.data &&
    childBankAccount.data.spending_limit_per_purchase &&
    childBankAccount.data.spending_limit_per_purchase !== Number.MAX_SAFE_INTEGER
      ? childBankAccount.data.spending_limit_per_purchase.toString()
      : "0"

  const translate = { daglig: "daily", ukentlig: "weekly", månedlig: "monthly" }

  const handleChangeSpendingLimit = async () => {
    await setSpendingLimit(selectedChildID || "", parseInt(spendingLimitInput), timeLimit)
    childBankAccount.refetch()
    setShowModal(false)
    setSpendingLimitInput("")
    setTimeLimit("daily")
  }

  const handleChangeSpendingLimitPerPurchase = async () => {
    await setSpendingLimitPerPurchase(selectedChildID || "", parseInt(spendingLimitPerPurchaseInput))
    childBankAccount.refetch()
    setShowModal2(false)
    setSpendingLimitPerPurchaseInput("")
  }

  if (children.some((query) => query.isPending)) {
    return <DataLoading />
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      {(parent.data?.children || []).length > 0 ? (
        <>
          <View className="flex items-center mt-6">
            <FlatList
              horizontal
              data={[...children.map((child) => child.data), { isSpecialItem: true, name: "dummyText" }]}
              renderItem={({ item, index }) => {
                if (!item) return null
                if ("isSpecialItem" in item) {
                  return (
                    <Pressable
                      className="items-center justify-center mb-8 ml-4 w-16"
                      onPress={() => router.push("/SignupChild")}
                    >
                      <AntDesign name="pluscircle" size={40} color="#CCF2F5" />
                    </Pressable>
                  )
                } else {
                  const isSelected = selectedChildIndex === index
                  return (
                    <Pressable className="flex-col items-center mx-3" onPress={() => setSelectedChildIndex(index)}>
                      <View
                        className={`rounded-full h-20 w-20 items-center overflow-hidden ${isSelected ? "border-4 border-blue-500" : ""}`}
                      >
                        <Image
                          source={{ uri: item.profilePicture }}
                          className="w-full h-full"
                          style={{ resizeMode: "cover" }}
                        />
                      </View>
                      <Text className="mt-2 font-medium text-sm">{item.name}</Text>
                    </Pressable>
                  )
                }
              }}
              keyExtractor={(item) => item?.name || ""}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View className="items-center mt-10">
            <Text className="font-semibold text-2xl">Saldo: {childBankAccount.data?.balance},-</Text>
            <Pressable
              className="py-3 px-10 bg-red-200 rounded-lg mt-6"
              onPress={() => router.push(`/Transactions?userID=${selectedChildID}`)}
            >
              <Text className="text-black text-lg font-semibold">Se transaksjoner</Text>
            </Pressable>
          </View>

          <Text className="text-center mt-10 font-bold text-xl">
            {children[selectedChildIndex].data?.name.split(" ")[0]} sine beløpsgrenser
          </Text>
          <View className="flex-row items-center mt-6 justify-center">
            <Text className="text-base">
              {spendingLimit === "0" || spendingLimit === Number.MAX_SAFE_INTEGER.toString()
                ? "Ingen beløpsgrense over tid"
                : `Grense på ${spendingLimit},- ${Object.keys(translate).find(
                    (key) => translate[key as keyof typeof translate] === childBankAccount.data?.spending_time_limit
                  )}`}
            </Text>
            <Pressable className="py-2 px-4 bg-red-200 rounded-lg ml-4" onPress={() => setShowModal(true)}>
              <Text className=" text-black font-semibold">
                {spendingLimit === "0" || spendingLimit === Number.MAX_SAFE_INTEGER.toString() ? "Konfigurer" : "Endre"}
              </Text>
            </Pressable>
          </View>
          <View className="flex-row items-center mt-8 justify-center">
            <Text className="text-base">
              {spendingLimitPerPurchase === "0" || spendingLimitPerPurchase === Number.MAX_SAFE_INTEGER.toString()
                ? "Ingen beløpsgrense per kjøp"
                : `Grense på ${spendingLimitPerPurchase},- per kjøp`}
            </Text>
            <Pressable className="py-2 px-4 bg-red-200 rounded-lg ml-4" onPress={() => setShowModal2(true)}>
              <Text className=" text-black font-semibold">
                {spendingLimitPerPurchase === "0" || spendingLimitPerPurchase === Number.MAX_SAFE_INTEGER.toString()
                  ? "Konfigurer"
                  : "Endre"}
              </Text>
            </Pressable>
          </View>

          <Modal transparent visible={showModal} onRequestClose={() => setShowModal(false)}>
            <Pressable className="flex-1 justify-center items-center" onPress={() => setShowModal(false)}>
              <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg">
                <Text className="text-lg font-bold mb-4">Sett beløpsgrense over tid</Text>
                <TextInput
                  className="border border-gray-300 p-3 mb-4 rounded-md text-base"
                  placeholder="Beløpsgrense (f.eks. 1000)"
                  keyboardType="numeric"
                  value={spendingLimitInput}
                  onChangeText={setSpendingLimitInput}
                />
                <View className="mb-4">
                  <Text className="mb-2">Over hvor lang tid?</Text>
                  <View className="flex flex-row gap-2">
                    <Pressable
                      className={`${timeLimit === "daily" ? "bg-blue-300" : "border border-gray-300"} p-2 rounded-lg`}
                      onPress={() => setTimeLimit("daily")}
                    >
                      <Text>Daglig</Text>
                    </Pressable>
                    <Pressable
                      className={`${timeLimit === "weekly" ? "bg-blue-300" : "border border-gray-300"} p-2 rounded-lg`}
                      onPress={() => setTimeLimit("weekly")}
                    >
                      <Text>Ukentlig</Text>
                    </Pressable>
                    <Pressable
                      className={`${timeLimit === "monthly" ? "bg-blue-300" : "border border-gray-300"} p-2 rounded-lg`}
                      onPress={() => setTimeLimit("monthly")}
                    >
                      <Text>Månedlig</Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable className="py-3 bg-blue-500 rounded-lg mt-2" onPress={handleChangeSpendingLimit}>
                  <Text className="text-white text-center font-semibold">Lagre</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
          <Modal transparent visible={showModal2} onRequestClose={() => setShowModal2(false)}>
            <Pressable className="flex-1 justify-center items-center" onPress={() => setShowModal2(false)}>
              <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg">
                <Text className="text-lg font-bold mb-4">Sett beløpsgrense per kjøp</Text>
                <TextInput
                  className="border border-gray-300 p-3 mb-4 rounded-md text-base"
                  placeholder="Beløpsgrense (f.eks. 1000)"
                  keyboardType="numeric"
                  value={spendingLimitPerPurchaseInput}
                  onChangeText={setSpendingLimitPerPurchaseInput}
                />
                <Pressable className="py-3 bg-blue-500 rounded-lg mt-2" onPress={handleChangeSpendingLimitPerPurchase}>
                  <Text className="text-white text-center font-semibold">Lagre</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
        </>
      ) : (
        <View className="mt-40 flex items-center">
          <Text>Det virker som du ikke har lagt til dine barn enda.</Text>
          <View className="flex flex-row gap-8 justify-center items-center mt-8">
            <Pressable onPress={() => router.push("/SignupChild")}>
              <AntDesign name="pluscircle" size={60} color="#3b82f6" />
            </Pressable>
            <Text className="text-lg">Legg til barn</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Overview
