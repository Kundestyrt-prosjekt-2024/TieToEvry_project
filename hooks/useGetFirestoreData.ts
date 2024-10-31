import { getProfilePictures } from '@/backend/src/ProfileDAO';
import { getUser } from '@/backend/src/UserDAO';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

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
    enabled: userID.length !== 0
  })
}

export const useGetProfilePictures = () => {
  return useQuery({
    queryKey: ["profilePictures"],
    queryFn: () => getProfilePictures()
  })
}