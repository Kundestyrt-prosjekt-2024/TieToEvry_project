import { View, Text, FlatList, Image, Pressable, Modal, TextInput } from "react-native";
import AppHeader from "@/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetBankAccount, useGetChildren, useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData";
import DataLoading from "@/components/DataLoading";
import { useState } from "react";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { setSpendingLimit } from "@/backend/src/bankAccountDAO";

const Overview = () => {
  const router = useRouter();

  const parentID = useGetUserID();
  const parent = useGetUser(parentID.data || "");
  const children = useGetChildren(parent.data?.children || []);

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [spendingLimitInput, setSpendingLimitInput] = useState("");
  const [timeLimit, setTimeLimit] = useState("");

  const selectedChildID = parent.data?.children?.[selectedChildIndex];
  const childBankAccount = useGetBankAccount(selectedChildID || "");

  const spendingLimit =
    childBankAccount.data &&
      childBankAccount.data.spending_limit &&
      childBankAccount.data.spending_limit !== Number.MAX_SAFE_INTEGER
      ? childBankAccount.data.spending_limit.toString()
      : "0";

  const handleChangeSpendingLimit = async () => {
    const translate = { daglig: "daily", ukentlig: "weekly", månedlig: "monthly" };
    const translatedTimeLimit = translate[timeLimit.toLowerCase() as keyof typeof translate];
    await setSpendingLimit(selectedChildID || "", parseInt(spendingLimitInput), translatedTimeLimit);
    childBankAccount.refetch();
    setShowModal(false);
    setSpendingLimitInput("");
    setTimeLimit("");
  };

  if (children.some((query) => query.isPending)) {
    return <DataLoading />;
  }

  return (
    <SafeAreaView className="bg-white h-full">
      <AppHeader parent />
      <View className="flex items-center mt-6">
        <FlatList
          horizontal
          data={[...children.map((child) => child.data), { isSpecialItem: true, name: "dummyText" }]}
          renderItem={({ item, index }) => {
            if (!item) return null;
            if ("isSpecialItem" in item) {
              return (
                <Pressable
                  className="items-center justify-center mb-8 ml-4 w-16"
                  onPress={() => router.push("/signupChild")}
                >
                  <AntDesign name="pluscircle" size={40} color="#CCF2F5" />
                </Pressable>
              );
            } else {
              const isSelected = selectedChildIndex === index;
              return (
                <Pressable
                  className="flex-col items-center mx-3"
                  onPress={() => setSelectedChildIndex(index)}
                >
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
              );
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
      
      <View className="flex-row items-center mt-16 px-8">
        <Text className="text-base">
          {children[selectedChildIndex]?.data?.name.split(" ")[0]} har 
          {spendingLimit === "0" || spendingLimit === Number.MAX_SAFE_INTEGER.toString() ? " ingen " : ` en beløpsgrense på ${spendingLimit},-`}
        </Text>
        <Pressable 
          className="py-2 px-4 bg-red-200 rounded-lg ml-4" 
          onPress={() => setShowModal(true)}
        >
          <Text className=" text-black font-semibold">
            {spendingLimit === "0" || spendingLimit === Number.MAX_SAFE_INTEGER.toString() ? "Konfigurer" : "Endre"}
          </Text>
        </Pressable>
      </View>

      <Modal transparent visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable className="flex-1 justify-center items-center" onPress={() => setShowModal(false)}>
          <Pressable className="bg-white rounded-lg w-4/5 p-6 shadow-lg">
            <Text className="text-lg font-bold mb-4">Sett beløpsgrense</Text>
            <TextInput
              className="border border-gray-300 p-3 mb-4 rounded-md text-base"
              placeholder="Beløpsgrense (f.eks. 1000)"
              keyboardType="numeric"
              value={spendingLimitInput}
              onChangeText={setSpendingLimitInput}
            />
            <TextInput
              className="border border-gray-300 p-3 mb-4 rounded-md text-base"
              placeholder="Tidsbegrensning (daglig, ukentlig, månedlig)"
              value={timeLimit}
              onChangeText={setTimeLimit}
            />
            <Pressable 
              className="py-3 bg-blue-500 rounded-lg mt-2" 
              onPress={handleChangeSpendingLimit}
            >
              <Text className="text-white text-center font-semibold">Lagre</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default Overview;
