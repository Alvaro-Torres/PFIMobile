import { Link } from "expo-router";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function PanierValide() {
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          Choose Goose approves your purchase!
        </Text>

        <Text style={styles.poem}>
          Your treasures are packed, adventure takes flight.
        </Text>

        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text>Retour au magasin</Text>
          </Pressable>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
 background:{flex:1},
 container:{
   flex:1,
   justifyContent:"center",
   alignItems:"center"
 },
 title:{
   fontSize:30,
   fontWeight:"900"
 },
 poem:{
   marginTop:20,
   fontSize:20
 },
 button:{
   marginTop:30,
   backgroundColor:"white",
   padding:15
 }
});