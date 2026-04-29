import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  quote: string;
  language: "en" | "fr";
  onLanguageChange: () => void;
};

export default function ChooseGooseHeader({
  quote,
  language,
  onLanguageChange,
}: Props) {
  const [showThoughts, setShowThoughts] = useState(false);

  function toggleThoughts() {
    setShowThoughts(!showThoughts);
  }

  function goToPanier() {
    router.push("/Panier" as any);
  }

  function goToInventaire() {
    router.push("/Inventaire" as any);
  }

  return (
    <>
      <Pressable style={styles.languageButton} onPress={onLanguageChange}>
        <Text style={styles.languageButtonText}>
          {language === "en" ? "FR" : "EN"}
        </Text>
      </Pressable>

      <View style={styles.header}>
        <Image
          source={require("../assets/images/shopping_time.png")}
          style={styles.titleImage}
          resizeMode="contain"
        />

        <View style={styles.speechBubble}>
          {!showThoughts ? (
            <Text style={styles.speechText}>{quote}</Text>
          ) : (
            <View style={styles.thoughtContent}>
              <Text style={styles.thoughtTitle}>
                {language === "en"
                  ? "Choose Goose thinks..."
                  : "Choose Goose pense..."}
              </Text>

              <View style={styles.thoughtButtons}>
                <Pressable style={styles.thoughtButton} onPress={goToPanier}>
                  <Text style={styles.cartEmoji}>🛒</Text>
                  <Text style={styles.thoughtButtonText}>
                    {language === "en" ? "Cart" : "Panier"}
                  </Text>
                </Pressable>

                <Pressable style={styles.thoughtButton} onPress={goToInventaire}>
                  <Image
                    source={require("../assets/images/chest.png")}
                    style={styles.chestIcon}
                  />
                  <Text style={styles.thoughtButtonText}>
                    {language === "en" ? "Inventory" : "Inventaire"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <Pressable
          onPress={toggleThoughts}
          style={({ pressed }) => [
            styles.gooseBubble,
            pressed && styles.bubblePressed,
          ]}
        >
          <Image
            source={require("../assets/images/bubble.png")}
            style={styles.gooseBubbleImage}
          />

          <Image
            source={require("../assets/images/choose_goose.png")}
            style={styles.gooseImage}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  languageButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 20,
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

  header: {
    height: 390,
    alignItems: "center",
    position: "relative",
  },

  titleImage: {
    position: "relative",
    top: 25,
    width: 260,
    height: 120,
  },

  speechBubble: {
    position: "relative",
    top: 15,
    width: "85%",
    minHeight: 110,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 35,
    paddingVertical: 14,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  speechText: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  thoughtContent: {
    alignItems: "center",
  },

  thoughtTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
    textAlign: "center",
  },

  thoughtButtons: {
    flexDirection: "row",
    gap: 12,
  },

  thoughtButton: {
    width: 115,
    backgroundColor: "#fff8d6",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },

  cartEmoji: {
    fontSize: 30,
    marginBottom: 3,
  },

  chestIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
    marginBottom: 3,
  },

  thoughtButtonText: {
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  gooseBubble: {
    position: "relative",
    top: 35,
    width: 125,
    height: 125,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 3,
    borderColor: "rgba(255,190,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  gooseBubbleImage: {
    position: "absolute",
    width: 135,
    height: 135,
    opacity: 0.75,
  },

  gooseImage: {
    width: 95,
    height: 95,
    borderRadius: 50,
  },

  bubblePressed: {
    transform: [{ scale: 0.95 }],
  },
});