import { FirestoreTimestamp } from "@/backend/types/firebase"
import DataLoading from "@/components/ui/DataLoading"
import { useGetUser, useGetUserID } from "@/hooks/useGetFirestoreData"
import { Tabs } from "expo-router"
import { DollarSign, GraduationCap, House, ListCheck, PiggyBank, Rabbit } from "lucide-react-native"
import { Text } from "react-native"

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
        name="Overview"
        redirect={!hideParentTabs}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <House color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Oversikt
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="ChoresParent"
        redirect={!hideParentTabs}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <ListCheck color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Gjøremål
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="SavingsParent"
        redirect={!hideParentTabs}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => <PiggyBank color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Sparemål
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Savings"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <PiggyBank color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Spare
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Chores"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <ListCheck color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Gjøremål
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Home"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <House color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Hjem
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Payment"
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <DollarSign color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Be om penger
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="Education"
        redirect={hideParentTabs}
        options={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => <GraduationCap color={focused ? "#52D1DC" : color} size={size} />,
          tabBarLabel: ({ color, focused }) => (
            <Text className="text-xs" style={{ color: focused ? "#52D1DC" : color }}>
              Lær mer
            </Text>
          ),
        }}
      />
    </Tabs>
  )
}

export default TabsLayout
