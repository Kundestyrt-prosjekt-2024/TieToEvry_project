import React from "react"
import Profile from "@/app/(profile)/profile"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useGetUserID, useGetUser, useGetProfilePictures } from "@/hooks/useGetFirestoreData"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { Keyboard } from "react-native"

jest.mock("@/hooks/useGetFirestoreData", () => ({
  useGetUserID: jest.fn(),
  useGetUser: jest.fn(),
  useGetProfilePictures: jest.fn(),
}))

jest.mock("@/backend/src/UserDAO", () => ({
  updateProfilePicture: jest.fn(),
}))

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}))

jest.mock("@react-native-async-storage/async-storage", () => ({
  removeItem: jest.fn(),
}))

jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react")
  const { View } = require("react-native")

  const BottomSheet = React.forwardRef(({ children }: { children: React.ReactNode }, ref: any) => {
    const [isVisible, setIsVisible] = React.useState(false)

    React.useImperativeHandle(ref, () => ({
      expand: () => setIsVisible(true),
      close: () => setIsVisible(false),
    }))

    return isVisible ? <View>{children}</View> : null
  })

  BottomSheet.Backdrop = () => null

  return BottomSheet
})

describe("Profile Screen", () => {
  const mockRouterReplace = jest.fn()
  const mockRouterNavigate = jest.fn()
  const mockRemoveItem = jest.fn()
  const mockRefetch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
      navigate: mockRouterNavigate,
    })
    ;(AsyncStorage.removeItem as jest.Mock).mockImplementation(mockRemoveItem)
    ;(useGetUserID as jest.Mock).mockReturnValue({
      data: "user123",
      isPending: false,
      isError: false,
    })
    ;(useGetUser as jest.Mock).mockReturnValue({
      data: {
        profilePicture: "https://example.com/profile.jpg",
        name: "John Doe",
        birthdate: {
          seconds: 946684800, // Jan 1, 2000
        },
      },
      isPending: false,
      isError: false,
      refetch: mockRefetch,
    })
    ;(useGetProfilePictures as jest.Mock).mockReturnValue({
      data: ["https://example.com/profile1.jpg", "https://example.com/profile2.jpg"],
      isPending: false,
      isError: false,
    })

    jest.spyOn(Keyboard, "dismiss").mockImplementation(() => {})
  })

  test("displays loading indicator when data is loading", () => {
    ;(useGetUserID as jest.Mock).mockReturnValue({
      isPending: true,
      isError: false,
    })

    const { getByText } = render(<Profile />)

    expect(getByText("Loading...")).toBeTruthy()
  })

  test("displays error component when there is an error", () => {
    ;(useGetUserID as jest.Mock).mockReturnValue({
      isPending: false,
      isError: true,
    })

    const { getByText } = render(<Profile />)

    expect(getByText("Oops! Something went wrong.")).toBeTruthy()
  })

  test("displays user information correctly", () => {
    const { getByText, getByTestId } = render(<Profile />)

    expect(getByText("John Doe")).toBeTruthy()

    const birthdateSeconds = 946684800 // Jan 1, 2000
    const birthDate = new Date(birthdateSeconds * 1000)
    const age = new Date().getUTCFullYear() - birthDate.getUTCFullYear()

    expect(getByText(`${age} år`)).toBeTruthy()

    const profileImage = getByTestId("profile-image")
    expect(profileImage.props.source.uri).toBe("https://example.com/profile.jpg")
  })

  test("opens and closes bottom sheet when edit and close buttons are pressed", () => {
    const { getByTestId, queryByTestId } = render(<Profile />)

    expect(queryByTestId("profile-bottom-sheet")).toBeNull()

    const editButton = getByTestId("edit-profile-picture-button")
    fireEvent.press(editButton)

    expect(queryByTestId("profile-bottom-sheet")).toBeTruthy()

    const closeButton = getByTestId("close-bottom-sheet-button")
    fireEvent.press(closeButton)

    expect(queryByTestId("profile-bottom-sheet")).toBeNull()
  })

  test('navigates to settings when "Innstillinger" button is pressed', () => {
    const { getByText } = render(<Profile />)
    const settingsButton = getByText("Innstillinger")
    fireEvent.press(settingsButton)
    expect(mockRouterNavigate).toHaveBeenCalledWith("/settings")
  })

  test('navigates to "Mine foreldre" when button is pressed', () => {
    const { getByText } = render(<Profile />)
    const myParentsButton = getByText("Mine foreldre")
    fireEvent.press(myParentsButton)
    expect(mockRouterNavigate).toHaveBeenCalledWith("/myParents")
  })

  test('logs out user when "Logg ut" button is pressed', async () => {
    const { getByText } = render(<Profile />)
    const logoutButton = getByText("Logg ut")
    fireEvent.press(logoutButton)

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith("userID")
      expect(mockRouterReplace).toHaveBeenCalledWith("/(auth)/login")
    })
  })
})
