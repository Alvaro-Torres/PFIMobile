import { useAudioPlayer } from "expo-audio";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import gooseQuotes from "../../assets/data/gooseQuotes.json";
import items from "../../assets/data/items.json";
import ChooseGooseHeader from "../../components/ChooseGooseHeader";

type Language = "en" | "fr";

const music = require("../../assets/sfx/adventure_time.mp3");

const images: Record<string, any> = {
  finn_sword: require("../../assets/images/finn_sword.png"),
  icecrown: require("../../assets/images/icecrown.png"),
  marceline_guitar: require("../../assets/images/marceline_guitar.png"),
  billy_sword: require("../../assets/images/billy_sword.png"),
  jakes_sandwich: require("../../assets/images/jakes_sandwich.png"),
  thumb_armor: require("../../assets/images/thumb_armor.png"),
  Enchiridion: require("../../assets/images/Enchiridion.png"),
  demon_blood_sword: require("../../assets/images/demon_blood_sword.png"),
};

export default function Index() {
  const [language, setLanguage] = useState<Language>("en");

  const { width } = useWindowDimensions();
  const isMobile = width < 700;

  const musicPlayer = useAudioPlayer(music);

  const randomIndex = Math.floor(Math.random() * gooseQuotes.length);
  const randomQuote = gooseQuotes[randomIndex];

  function startMusic() {
    musicPlayer.loop = true;
    musicPlayer.volume = 0.5;
    musicPlayer.play();
  }

  function changeLanguage() {
    if (language === "en") {
      setLanguage("fr");
    } else {
      setLanguage("en");
    }
  }

  function showItems() {
    const itemViews = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      itemViews.push(
        <View
          key={item.id}
          style={[styles.itemBox, isMobile && styles.itemBoxMobile]}
        >
          <Text style={styles.itemName}>{item.name[language]}</Text>
<Pressable
  onPress={() =>
    router.push({
      pathname: "/AjouterAuPanier",
      params: { id: item.id }
    })
  }
  style={({ hovered, pressed }) => [
    styles.itemBubble,
    isMobile && styles.itemBubbleMobile,
    hovered && styles.bubbleHover,
    pressed && styles.bubblePressed,
  ]}
>
  <Image
    source={images[item.image]}
    style={[styles.itemImage, isMobile && styles.itemImageMobile]}
  />
</Pressable>
   
          <View style={styles.priceRow}>
            <Image
              source={require("../../assets/images/gold.png")}
              style={styles.goldIcon}
            />

            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        </View>
      );
    }

    return itemViews;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <Pressable style={styles.musicButton} onPress={startMusic}>
        <Text style={styles.musicButtonText}>♪</Text>
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ChooseGooseHeader
          quote={randomQuote[language]}
          language={language}
          onLanguageChange={changeLanguage}
        />

        <View style={[styles.grid, isMobile && styles.gridMobile]}>
          {showItems()}
        </View>

        <Link href="/connexion" asChild>
          <Pressable style={styles.connexionButton}>
            <Text style={styles.connexionButtonText}>
              {language === "en" ? "Login / Sign up" : "Connexion / S'inscrire"}
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

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 80,
  },

  musicButton: {
    position: "absolute",
    top: 15,
    right: 70,
    zIndex: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  musicButtonText: {
    fontSize: 14,
    fontWeight: "900",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 50,
    columnGap: 15,
    paddingHorizontal: 40,
    marginTop: 40,
  },

  gridMobile: {
    paddingHorizontal: 10,
    rowGap: 25,
    columnGap: 10,
  },

  itemBox: {
    width: "22%",
    alignItems: "center",
  },

  itemBoxMobile: {
    width: "45%",
  },

  itemName: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    color: "black",
    backgroundColor: "rgba(255,255,255,0.78)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  itemBubble: {
    width: 120,
    height: 120,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 3,
    borderColor: "rgba(255, 190, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  itemBubbleMobile: {
    width: 105,
    height: 105,
  },

  bubbleHover: {
    transform: [{ scale: 1.12 }],
    backgroundColor: "rgba(255,255,255,0.6)",
    borderColor: "rgba(255, 120, 255, 1)",
  },

  bubblePressed: {
    transform: [{ scale: 0.95 }],
  },

  itemImage: {
    width: 82,
    height: 82,
    resizeMode: "contain",
  },

  itemImageMobile: {
    width: 72,
    height: 72,
  },

  priceRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.78)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  goldIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },

  itemPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "black",
  },

  connexionButton: {
    alignSelf: "center",
    marginTop: 60,
    marginBottom: 80,
    backgroundColor: "#fff8d6",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },

  connexionButtonText: {
    fontSize: 18,
    fontWeight: "900",
    color: "black",
  },
});