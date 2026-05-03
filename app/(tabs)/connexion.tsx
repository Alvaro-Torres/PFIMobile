import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import connexionText from "../../assets/data/connexionButtons.json";
import { useCart } from "../../components/PanierContext";
import db from "../../database";

type Language = "en" | "fr";

type User = {
  id: number;
  username?: string;
  email: string;
  password: string;
  role: string;
  solde: number;
};

export default function Connexion() {
  const [language, setLanguage] = useState<Language>("en");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const { setLoggedUser } = useCart();

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
  }



  async function handleLogin() {
    setError("");


    // Connexion avec courriel ou nom d'utilisateur
    // Le courriel est passé deux fois : une fois pour vérifier le courriel, une fois pour vérifier le nom d'utilisateur
    const user = await db.getFirstAsync<User>(
      "SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?",
      [email, email, password]
    );

    if (!user) {
      setError(
        language === "en"
          ? "Invalid email or password."
          : "Courriel ou mot de passe invalide."
      );
      return;
    }

    setLoggedUser({
      id: user.id,
      email: user.email,
      solde: user.solde ?? 500,
      role: user.role,
    });

    router.push("/");
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <Pressable style={styles.languageButton} onPress={changeLanguage}>
        <Text style={styles.languageButtonText}>
          {language === "en" ? "FR" : "EN"}
        </Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{connexionText.title[language]}</Text>

          <TextInput
            style={styles.input}
            placeholder={connexionText.usernamePlaceholder[language]}
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder={connexionText.passwordPlaceholder[language]}
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.mainButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              {connexionText.loginButton[language]}
            </Text>
          </Pressable>

          <Link href="/(tabs)/inscription" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.buttonText}>
                {connexionText.signupButton[language]}
              </Text>
            </Pressable>
          </Link>
        </View>

        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>
              {connexionText.backButton[language]}
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  backgroundImage: {
    resizeMode: "cover",
  },

  languageButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  languageButtonText: {
    fontSize: 14,
    fontWeight: "900",
  },

  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },

  card: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "rgba(255,248,214,0.92)",
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 25,
  },

  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
  },

  mainButton: {
    width: "100%",
    backgroundColor: "#ffdf6b",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 10,
  },

  secondaryButton: {
    width: "100%",
    backgroundColor: "#b8f7ff",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 12,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "900",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },

  backButtonText: {
    fontSize: 15,
    fontWeight: "900",
  },
});