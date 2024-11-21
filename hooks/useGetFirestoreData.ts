import { getBankAccountByUID } from "@/backend/src/bankAccountDAO"
import { createChore, getAllChores, getChoreIcons, getChoresByStatus, updateChoreStatus } from "@/backend/src/choreDAO"
import { getMoneyRequests } from "@/backend/src/moneyRequestsDAO"
import { getProfilePictures } from "@/backend/src/ProfileDAO"
import { getSavingGoals } from "@/backend/src/savingsDAO"
import { getTransactionHistory, getTransactionHistoryBetweenAccounts } from "@/backend/src/transactionsDAO"
import { getUser } from "@/backend/src/UserDAO"
import { BankAccount } from "@/backend/types/bankAccount"
import { Chore } from "@/backend/types/chore"
import { User } from "@/backend/types/user"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetUserID = () => {
  return useQuery({
    queryKey: ["userID"],
    queryFn: () => AsyncStorage.getItem("userID"),
  })
}

export const useGetUser = (userID: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["user", userID],
    queryFn: () =>
      getUser(userID, (updatedData) => {
        queryClient.setQueryData(["user", userID], (oldData: User | undefined) => {
          if (!oldData) return updatedData
          return { ...oldData, ...updatedData }
        })
      }),
    enabled: userID.length !== 0,
  })
}

export const useGetProfilePictures = () => {
  return useQuery({
    queryKey: ["profilePictures"],
    queryFn: () => getProfilePictures(),
  })
}

export const useGetChildren = (childrenIDs: string[]) => {
  const queryClient = useQueryClient()

  return useQueries({
    queries: childrenIDs.map((id) => ({
      queryKey: ["user", id],
      queryFn: () =>
        getUser(id, (updatedData) => {
          queryClient.setQueryData(["user", id], (oldData: User | undefined) => {
            if (!oldData) return updatedData
            return { ...oldData, ...updatedData }
          })
        }),
      enabled: childrenIDs.length !== 0,
    })),
  })
}

export const useGetParents = (parentIDs: string[]) => {
  const queryClient = useQueryClient()

  return useQueries({
    queries: parentIDs.map((id) => ({
      queryKey: ["user", id],
      queryFn: () =>
        getUser(id, (updatedData) => {
          queryClient.setQueryData(["user", id], (oldData: User | undefined) => {
            if (!oldData) return updatedData
            return { ...oldData, ...updatedData }
          })
        }),
      enabled: parentIDs.length !== 0,
    })),
  })
}

export const useGetBankAccount = (userID: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["bankAccount", userID],
    queryFn: () =>
      getBankAccountByUID(userID, (updatedData) => {
        queryClient.setQueryData(["bankAccount", userID], (oldData: (BankAccount & { id: string }) | undefined) => {
          if (!oldData) return updatedData
          return { ...oldData, ...updatedData }
        })
      }),
    enabled: userID.length !== 0,
  })
}

export const useGetBankAccounts = (userIDs: string[]) => {
  const queryClient = useQueryClient()

  const queries = useQueries({
    queries: userIDs.map((userID) => ({
      queryKey: ["bankAccount", userID],
      queryFn: () =>
        getBankAccountByUID(userID, (updatedData) => {
          queryClient.setQueryData(["bankAccount", userID], (oldData: (BankAccount & { id: string }) | undefined) => {
            if (!oldData) return updatedData
            return { ...oldData, ...updatedData }
          })
        }),
      enabled: userIDs.length !== 0,
    })),
  })

  return queries
}

export const useGetSavingGoals = (userId: string) => {
  return useQuery({
    queryKey: ["savingGoals", userId],
    queryFn: () => getSavingGoals(userId),
    enabled: userId.length !== 0,
  })
}

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

export const useGetTransactionHistory = (accountID: string, fromDate?: Date, toDate?: Date) => {
  if (!fromDate && !toDate) {
    return useQuery({
      queryKey: ["transactionHistory", accountID],
      queryFn: () => getTransactionHistory(accountID),
      enabled: accountID.length !== 0,
    })
  } else if (!toDate) {
    return useQuery({
      queryKey: ["transactionHistory", accountID],
      queryFn: () => getTransactionHistory(accountID, fromDate),
      enabled: accountID.length !== 0,
    })
  } else if (!fromDate) {
    return useQuery({
      queryKey: ["transactionHistory", accountID],
      queryFn: () => getTransactionHistory(accountID, undefined, toDate),
      enabled: accountID.length !== 0,
    })
  } else {
    return useQuery({
      queryKey: ["transactionHistory", accountID],
      queryFn: () => getTransactionHistory(accountID, fromDate, toDate),
      enabled: accountID.length !== 0,
    })
  }
}

export const useGetTransactionHistoryBetweenAccounts = (accountID1: string, accountID2: string) => {
  return useQuery({
    queryKey: ["transactionHistory", accountID1, accountID2],
    queryFn: () => getTransactionHistoryBetweenAccounts(accountID1, accountID2),
    enabled: accountID1.length !== 0 && accountID2.length !== 0,
  })
}

export const useGetMoneyRequests = (userID: string) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["moneyRequests", userID],
    queryFn: () =>
      getMoneyRequests(userID, (updatedRequests) => {
        queryClient.setQueryData(["moneyRequests", userID], updatedRequests)
      }),
    enabled: userID.length !== 0,
  })
}
