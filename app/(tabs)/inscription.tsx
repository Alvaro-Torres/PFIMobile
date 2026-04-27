import { Link } from "expo-router";
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

import inscriptionText from "../../assets/data/inscription.json";

type Language = "en" | "fr";

export default function Inscription() {
  const [language, setLanguage] = useState<Language>("en");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
  }

  function handleSignup() {
    setError("");

    if (!email || !password || !confirmPassword) {
      setError(inscriptionText.errorRequired[language]);
      return;
    }
    if (!email.includes("@")) {
      setError(inscriptionText.errorEmail[language]);
      return;
    }
    if (password !== confirmPassword) {
      setError(inscriptionText.errorPassword[language]);
      return;
    }

    setLoading(true);
    // TODO: call your signup API here
    console.log("signup later");
    setLoading(false);
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
          <Text style={styles.title}>{inscriptionText.title[language]}</Text>

          <TextInput
            style={styles.input}
            placeholder={inscriptionText.emailPlaceholder[language]}
            placeholderTextColor="#555"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder={inscriptionText.passwordPlaceholder[language]}
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder={inscriptionText.confirmPasswordPlaceholder[language]}
            placeholderTextColor="#555"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={styles.mainButton}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? inscriptionText.loading[language]
                : inscriptionText.createButton[language]}
            </Text>
          </Pressable>
        </View>

        <Link href="/connexion" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>
              {inscriptionText.backButton[language]}
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  errorText: {
    color: "red",
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
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