import React from "react"
import { View, Text, StyleSheet } from "react-native"

const AppHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>2387</Text>
      <Text style={styles.headerText}>2387</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
})

export default AppHeader
