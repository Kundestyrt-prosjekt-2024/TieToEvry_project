import AppHeader from "@/components/AppHeader";
import { View, Text, StyleSheet, Pressable, Image, Modal, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Chore } from "../types/chores";
import React from "react";
import ChoreList from "@/components/chores/chore";
import { ScrollView } from "react-native-gesture-handler";
import ChoresDetailedView from "@/components/chores/choresDetailedView";
import { HandPlatter } from "lucide-react-native";

const Chores = () => {
  const [viewChore, toggleView] = React.useState(false);
  const [choreOfInterest, setChoreOfInterest] = React.useState<Chore | null>(null);

  const chores: Chore[] = [
    {
      icon: <HandPlatter />,
      chore: "chore1",
      name: "Vask opp",
      description: "Vask opp alle tallerkner, glass og bestikk",
      reward: 75,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
      completed: false,
      assignee: "Mamma",
    },
    {
      chore: "chore2",
      name: "Rydde rommet",
      description: "Rommet ditt er rotete og må ryddes. Du vet hvordan det skal være",
      reward: 50,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 6)), 
      completed: false,
      assignee: "Mamma",
    },
    {
      chore: "chore3",
      name: "Gå tur med Laila",
      description: "Du har ikke gått tur med Laila denne uken. Det kan du gjøre.",
      reward: 100,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 9)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore4",
      name: "Vaske sjarken",
      description: "Sjarken er skitten og trenger en vask. Husk å skrubbe dekket godt! Onkel blir fornøyd.",
      reward: 200,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 4)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore5",
      name: "Vaske fesken",
      description: "Fesken har blitt skitten og trenger en vask. Husk å skrubbe den godt! Vi vil ikke ha skitten fesk.",
      reward: 30,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Mamma",
    },
    {
      chore: "chore6",
      name: "Gjøre lekser",
      description: "Du har fått lekser av lærer Saddam. Gjør de!",
      reward: 60,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore7",
      name: "Gjøre lekser",
      description: "Du har fått lekser av lærer Saddam. Gjør de!",
      reward: 60,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Pappa",
    },
    {
      chore: "chore8",
      name: "Gjøre lekser",
      description: "Du har fått lekser av lærer Saddam. Gjør de!",
      reward: 60,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), 
      completed: false,
      assignee: "Pappa",
    },
  ];
  
  const cashMulla = {
    mulla:14243545,
    sphareCoin: 3245,
  };

  const setViewChore =(chore: Chore) => {
    setChoreOfInterest(chore);
    toggleModal();
  }
  const toggleModal = () => {
    toggleView((prevState) => !prevState);
  }
  return (
    <SafeAreaView>
      <AppHeader />
      <View style={styles.parentView}>
        <Text style={styles.headerText}>Her kan du spare med Sphare!</Text>
        <View style={styles.sphareSays}>
          <Image
            style={{ width: 150, height: 200, resizeMode: "contain", borderRadius: 4 }}
            source={require("@/assets/images/sphare1.png")}
          />
          <View style={{flexDirection:"column", justifyContent: "center", alignItems: "center", flex:1, flexWrap: "wrap",}}>
            <Text style={styles.sphareSaysHeader}>Du har tjent:</Text>
            <Text style={styles.sphareSaysMoney}>{cashMulla.mulla},-</Text>
            <View style={{flexDirection:"row",flex:1, flexWrap: "wrap", alignItems:"center"}}>
              <Image
              style={{ width: 35, height: 35, resizeMode: "contain", borderRadius: 4 }}
              source={require("@/assets/images/coin.png")}/>
              <Text style={styles.sphareSaysCoin}>x{cashMulla.sphareCoin}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}>
            <Text style={{alignItems:"center", textAlign:"center", fontSize:20, padding:6,
                  borderBottomWidth: 1, borderBottomColor: "#52D1DC"
            }}>Aktive gjøremål 👇</Text>
          <ScrollView style={styles.list}>
            {/* Render list of chores */}
            {chores.map((chore, index) => (
              <View key={index}>
                <ChoreList chore={chore} onClick={() => setViewChore(chore)} />
              </View>
            ))}
            </ScrollView>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#52D1DC" }}></View>
          {choreOfInterest && (
          <Modal
          visible={viewChore}
          animationType="none"
          transparent={true}
          onRequestClose={toggleModal}>
            <View style={{height:"100%", width: "100%", justifyContent: "center", alignContent: "center"}}>
              <View style={styles.modalView}>
                {choreOfInterest && (
                  <ChoresDetailedView
                    chore={choreOfInterest}
                    onClick={toggleModal} // Close the modal when clicked
                  />
                )}
                {/* <Button title="Close" onPress={toggleModal} /> */}
              </View>
            </View>
          </Modal>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  parentView: {
    height: "100%",
    backgroundColor: "white",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  headerText: {
    padding: 4,
    fontSize: 20,
    fontWeight: "semibold",
    textAlign: "center",
  },
  sphareSays: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  sphareSaysHeader: {
    fontSize: 35 ,
    fontWeight: "semibold",
    color: "#52D1DC",
    flex: 1,
    flexWrap: "wrap",
  },
  sphareSaysMoney: {
    fontSize: 30,
    fontWeight: "semibold",
    textAlign: "center",
    flex: 1,
    flexWrap: "wrap",
  },
  sphareSaysCoin: {
    //Appears to not apply
    fontSize: 25,
    fontWeight: "semibold",
    textAlign: "center",
    flexWrap: "wrap",
  },
  body:{
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  list:{
    height: 350,
  },
  modalView:{
    padding: 16,
  }
})

export default Chores
