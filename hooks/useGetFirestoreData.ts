import { getBankAccountByUID } from "@/backend/src/bankAccountDAO"
import { getProfilePictures } from "@/backend/src/ProfileDAO"
import { getSavingGoals } from "@/backend/src/savingsDAO"
import { getUser } from "@/backend/src/UserDAO"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useQueries, useQuery } from "@tanstack/react-query"

export const useGetUserID = () => {
  return useQuery({
    queryKey: ["userID"],
    queryFn: () => AsyncStorage.getItem("userID"),
  })
}

export const useGetUser = (userID: string) => {
  return useQuery({
    queryKey: ["user", userID],
    queryFn: () => getUser(userID),
    enabled: userID.length !== 0, // only fetch data when userID is not empty
  })
}

export const useGetProfilePictures = () => {
  return useQuery({
    queryKey: ["profilePictures"],
    queryFn: () => getProfilePictures(),
  })
}

export const useGetChildren = (childrenIDs: string[]) => {
  return useQueries({
    queries: childrenIDs.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => getUser(id),
      enabled: childrenIDs.length !== 0,
    })),
  })
}

export const useGetBankAccount = (userID: string) => {
  return useQuery({
    queryKey: ["bankAccount", userID],
    queryFn: () => getBankAccountByUID(userID),
    enabled: userID.length !== 0,
  })
}

export const useGetSavingGoals = (userId: string) => {
  return useQuery({
    queryKey: ["savingGoals", userId],
    queryFn: () => getSavingGoals(userId),
    enabled: userId.length !== 0,
  })
}
