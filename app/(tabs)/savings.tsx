import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
} from "react-native"
import ReusableBottomSheet from "@/components/ui/ReusableBottomSheet"
import NewGoalContent from "@/components/savings/NewGoalContent"
import AddMoneyContent from "@/components/savings/AddMoneyContent"
import AppHeader from "@/components/ui/AppHeader"
import SavingGoalCard from "@/components/savings/SavingGoalCard"
import { useGetSavingGoals, useGetUserID /**useGetSavingGoals*/ } from "@/hooks/useGetFirestoreData"
import { SavingGoal } from "@/backend/types/savingGoal"

const Savings = () => {
  // Hooks for UserID and saving goals.
  const { data: userID, isLoading: isUserIDLoading } = useGetUserID()
  const userIDValue = userID ?? ""
  const { data: savingGoals, isLoading: isSavingGoalsLoading, refetch } = useGetSavingGoals(userIDValue)

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch() // Refetch every 1 second
    }, 500)

    return () => clearInterval(intervalId) // Cleanup interval on unmount
  }, [savingGoals])

  // States for showing/hiding bottom sheets
  const [isNewGoalVisible, setIsNewGoalVisible] = useState(false)
  const [isAddMoneyVisible, setIsAddMoneyVisible] = useState(false)

  // Saving goal to see when bottom sheet for adding money is in focus
  const [savingGoal, setSavingGoal] = useState<SavingGoal | undefined>()

  const sortedGoals =
    savingGoals
      ?.sort((a, b) => {
        // Calculate progress for both goals
        const progressA = a.current_amount / a.goal_amount
        const progressB = b.current_amount / b.goal_amount

        // If progress is >= 1, move to the beginning
        if (progressA >= 1 && progressB < 1) {
          return -1 // a comes before b
        } else if (progressA < 1 && progressB >= 1) {
          return 1 // b comes before a
        } else {
          return 0 // keep original order for other cases
        }
      })
      .reverse() || []

  //Functions to handle showing/hiding bottom sheets
  const handleAddMoney = () => {
    setIsAddMoneyVisible(true)
    dismissKeyboard()
  }

  const handleCloseAddMoney = () => {
    setIsAddMoneyVisible(false)
    dismissKeyboard()
  }

  const handleNewGoalPress = () => {
    setIsNewGoalVisible(true)
    dismissKeyboard()
  }

  const handleCloseNewGoal = () => {
    setIsNewGoalVisible(false)
    dismissKeyboard()
  }

  //Hiding keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss()
  }

  return (
    <SafeAreaView className="bg-white">
      <AppHeader />
      <View className="h-full">
        <ScrollView>
          {/**Top view introducing user to the page */}
          <View className="flex-row pt-5 px-10">
            <View>
              <Image className="w-85 h-154" source={require("@/assets/images/sphare.png")} />
            </View>
            <View className="flex-col justify-end">
              <View className="relative justify-center px-8 py-4 items-center">
                <Image className="" source={require("@/assets/images/figma_bubble.png")} />
                <Text className="absolute pl-2 pt-1 text-sm text-black text-center">
                  Lag et sparemål for å komme i gang!
                </Text>
              </View>
              <View className="justify-end px-8">
                <Text className="text-2xl">Dine sparemål</Text>
              </View>
            </View>
          </View>

          {/* Current savings goals displayed in cards. */}
          <View className="flex-col items-center py-5 pb-20">
            {sortedGoals && sortedGoals.length > 0 ? (
              sortedGoals.map((goal) => (
                <SavingGoalCard
                  key={goal.id}
                  goal={goal}
                  onAddMoney={handleAddMoney}
                  setSavingGoal={() => setSavingGoal(goal)}
                />
              ))
            ) : (
              <Text>Du har ingen aktive sparemål!</Text>
            )}
          </View>
        </ScrollView>

        {/**Static button to create new saving goal */}
        <View className="absolute flex-col items-center bottom-20 right-5 mb-7">
          <TouchableOpacity className="bg-[#FFC5D3] w-10 h-10 rounded-full" onPress={handleNewGoalPress}>
            <Text className="w-10 h-10 text-center text-3xl">+</Text>
          </TouchableOpacity>
          <Text className="text-xs text-center">Nytt mål</Text>
        </View>
      </View>

      {/**Bottom sheet for creating new goal */}
      <TouchableWithoutFeedback
        onPress={() => {
          dismissKeyboard()
        }}
      >
        <ReusableBottomSheet isVisible={isNewGoalVisible} onClose={handleCloseNewGoal}>
          <NewGoalContent onClose={handleCloseNewGoal} userId={userIDValue} refetch={refetch} />
        </ReusableBottomSheet>
      </TouchableWithoutFeedback>

      {/**Bottom sheets for adding money to a goal */}
      <TouchableWithoutFeedback
        onPress={() => {
          dismissKeyboard()
        }}
      >
        <ReusableBottomSheet isVisible={isAddMoneyVisible} onClose={handleCloseAddMoney}>
          <AddMoneyContent savingGoal={savingGoal} onClose={handleCloseAddMoney} refetch={refetch} />
        </ReusableBottomSheet>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Savings
