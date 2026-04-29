import { Link, useLocalSearchParams } from "expo-router";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PanierValide() {
  const params = useLocalSearchParams();
  const status = params.status;

  let title = "Panier validé!";
  let poem =
    "Tes trésors sont prêts, ton aventure s'éveille! Choose Goose sourit sous la douce merveille!";

  if (status === "notLogged") {
    title = "Connexion requise!";
    poem =
      "Petit voyageur sans identité, connecte-toi pour être enchanté!";
  }

  if (status === "noMoney") {
    title = "Solde insuffisant!";
    poem =
      "Tes poches sont légères, ton rêve attend demain; remplis ton coffre et reviens en chemin!";
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.speechBubble}>
            <Text style={styles.poem}>{poem}</Text>
          </View>

          <View style={styles.gooseBubble}>
            <Image
              source={require("../../assets/images/bubble.png")}
              style={styles.gooseBubbleImage}
            />

            <Image
              source={require("../../assets/images/choose_goose.png")}
              style={styles.gooseImage}
              resizeMode="contain"
            />
          </View>

          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.buttonText}>Retour au magasin</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  backgroundImage: {
    resizeMode: "cover",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  card: {
    width: "92%",
    backgroundColor: "rgba(255,248,214,0.94)",
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 18,
  },

  speechBubble: {
    width: "100%",
    minHeight: 115,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 35,
    paddingVertical: 16,
    paddingHorizontal: 18,
    justifyContent: "center",
    marginBottom: 22,
  },

  poem: {
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 25,
  },

  gooseBubble: {
    width: 135,
    height: 135,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 3,
    borderColor: "rgba(255,190,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 25,
  },

  gooseBubbleImage: {
    position: "absolute",
    width: 145,
    height: 145,
    opacity: 0.75,
  },

  gooseImage: {
    width: 105,
    height: 105,
    borderRadius: 55,
  },

  backButton: {
    backgroundColor: "#b8f7ff",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "black",
  },
});