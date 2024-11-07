import { FirestoreTimestamp } from "@/backend/types/user"
import DataLoading from "@/components/DataLoading"
import { useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { Tabs } from "expo-router"
import { Coins, DollarSign, GraduationCap, House, ListCheck, PiggyBank, Rabbit } from "lucide-react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

const TabsLayout = () => {
  const userID = useGetUserID()
  const user = useGetUser(userID.data || "")

  function calculateAge(birthdayTimestamp: FirestoreTimestamp): number {
    const birthDate = new Date(birthdayTimestamp.seconds * 1000)
    const ageDifMs = Date.now() - birthDate.getTime()
    return new Date(ageDifMs).getUTCFullYear() - 1970
  }

  const hideParentTabs = user.data && calculateAge(user.data.birthdate) > 18

  if (user.isPending) {
    return <DataLoading />
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="overview"
        redirect={!hideParentTabs}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <PiggyBank color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: "Oversikt",
        }}
      />
      <Tabs.Screen
        name="savings"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <PiggyBank color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: "Spare",
        }}
      />
      <Tabs.Screen
        name="chores"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <ListCheck color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: "Gjøremål",
        }}
      />
      <Tabs.Screen
        name="home"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <House color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: "Hjem",
        }}
      />
      <Tabs.Screen
        name="payment"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <DollarSign color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: "Be om penger",
        }}
      />
      <Tabs.Screen
        name="education"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <GraduationCap color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: "Lær mer",
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
