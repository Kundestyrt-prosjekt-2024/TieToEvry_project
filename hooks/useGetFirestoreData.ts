import { getBankAccountByUID } from "@/backend/src/bankAccountDAO"
import { createChore, getAllChores, getChoreIcons, getChoresByStatus, updateChoreStatus } from "@/backend/src/choreDAO"
import { getProfilePictures } from "@/backend/src/ProfileDAO"
import { getSavingGoals } from "@/backend/src/savingsDAO"
import { getUser } from "@/backend/src/UserDAO"
import { Chore } from "@/backend/types/chore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useMutation, useQueries, useQuery } from "@tanstack/react-query"

// User

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

// Bank account

export const useGetBankAccount = (userID: string) => {
  return useQuery({
    queryKey: ["bankAccount", userID],
    queryFn: () => getBankAccountByUID(userID),
    enabled: userID.length !== 0,
  })
}

// Saving goals

export const useGetSavingGoals = (userId: string) => {
  return useQuery({
    queryKey: ["savingGoals", userId],
    queryFn: () => getSavingGoals(userId),
    enabled: userId.length !== 0,
  })
}

// Chores

export const useCreateChore = () => {
  return useMutation({
    mutationFn: (chore: Chore) => createChore(chore),
  })
}

export const useUpdateChoreStatus = () => {
  return useMutation({
    mutationFn: ({ chore, status }: { chore: Chore; status: string }) => updateChoreStatus(chore, status),
  })
}

export const useGetChoreIcons = () => {
  return useQuery({
    queryKey: ["choreIcons"],
    queryFn: () => getChoreIcons(),
  })
}

export const useGetChoresByStatus = (child_id: string, status: string) => {
  return useQuery({
    queryKey: ["chores", child_id, status],
    queryFn: () => getChoresByStatus(child_id, status),
    enabled: child_id.length !== 0,
  })
}

export const useGetChores = (child_id: string) => {
  return useQuery({
    queryKey: ["chores", child_id],
    queryFn: () => getAllChores(child_id),
    enabled: child_id.length !== 0,
  })
}
