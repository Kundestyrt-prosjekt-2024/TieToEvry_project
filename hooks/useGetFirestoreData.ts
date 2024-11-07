import { getProfilePictures } from '@/backend/src/ProfileDAO';
//import { getSavingGoals } from '@/backend/src/SavingsDAO';
import { getUser } from '@/backend/src/UserDAO';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { getSavingGoals } from '@/backend/src/SavingsDAO';


export const useGetUserID = () => {
  return useQuery({
    queryKey: ["userID"],
    queryFn: () => AsyncStorage.getItem("userID")
  })
}

export const useGetUser = (userID: string) => {
  return useQuery({
    queryKey: ["user", userID],
    queryFn: () => getUser(userID),
    enabled: userID.length !== 0 // only fetch data when userID is not empty
  })
}

export const useGetProfilePictures = () => {
  return useQuery({
    queryKey: ["profilePictures"],
    queryFn: () => getProfilePictures()
  })
}


export const useGetSavingGoals = (userId: string) => {
  return useQuery({
    queryKey: ['savingGoals', userId],
    queryFn: () => getSavingGoals(userId),
    enabled: userId.length !== 0,
  });
};

/**
 * TODO: Add a hook for updating the current_amount field in the saving goal.
 */