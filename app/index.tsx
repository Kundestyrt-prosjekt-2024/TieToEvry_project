import { Redirect } from "expo-router"
import { useGetUserID } from "@/hooks/useGetFirestoreData"
import DataLoading from "@/components/ui/DataLoading"

export default function index() {
  const userID = useGetUserID()

  // Render a loading state while checking AsyncStorage
  if (userID.isPending) {
    return <DataLoading />
  }

  // Conditionally redirect based on user data
  if (userID.data) {
    return <Redirect href="/(tabs)/home" />
  } else {
    return <Redirect href="/(auth)/login" />
  }
}
