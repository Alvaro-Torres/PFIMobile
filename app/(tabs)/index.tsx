import { useAudioPlayer } from "expo-audio";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import gooseQuotes from "../../assets/data/gooseQuotes.json";
import items from "../../assets/data/items.json";

type Language = "en" | "fr";

const music = require("../../assets/sfx/adventure_time.mp3");

const images: Record<string, any> = {
  finn_sword: require("../../assets/images/finn_sword.png"),
  icecrown: require("../../assets/images/icecrown.png"),
  marceline_guitar: require("../../assets/images/marceline_guitar.png"),
  billy_sword: require("../../assets/images/billy_sword.png"),
  jakes_sandwich: require("../../assets/images/jakes_sandwich.png"),
  thumb_armor: require("../../assets/images/thumb_armor.png"),
  enchiridion: require("../../assets/images/enchiridion.png"),
  demon_blood_sword: require("../../assets/images/demon_blood_sword.png"),
};

export default function Index() {
  const [language, setLanguage] = useState<Language>("en");
  const [animationKey, setAnimationKey] = useState(0);

  const musicPlayer = useAudioPlayer(music);

  const randomQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * gooseQuotes.length);
    return gooseQuotes[randomIndex];
  }, []);

  const allBubbles = useMemo(() => {
    return [
      new Animated.Value(0), // Choose Goose
      ...items.map(() => new Animated.Value(0)),
    ];
  }, [animationKey]);

  useEffect(() => {
    musicPlayer.loop = true;
    musicPlayer.play();
  }, []);

  useEffect(() => {
    allBubbles.forEach((bubble) => bubble.setValue(0));

    Animated.stagger(
      120,
      allBubbles.map((bubble) =>
        Animated.spring(bubble, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
          tension: 60,
        })
      )
    ).start();
  }, [animationKey]);

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
    setAnimationKey(animationKey + 1);
  }

  function getBubbleStyle(index: number) {
    return {
      opacity: allBubbles[index],
      transform: [
        {
          scale: allBubbles[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
          }),
        },
        {
          translateY: allBubbles[index].interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0],
          }),
        },
      ],
    };
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

      <View style={styles.header}>
        <Image
          source={require("../../assets/images/shopping_time.png")}
          style={styles.titleImage}
          resizeMode="contain"
        />

        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{randomQuote[language]}</Text>
        </View>

        <Animated.View style={[styles.gooseBubbleWrapper, getBubbleStyle(0)]}>
          <Pressable
            onPress={() => console.log("Choose Goose clicked")}
            style={({ hovered, pressed }) => [
              styles.gooseBubble,
              hovered && styles.bubbleHover,
              pressed && styles.bubblePressed,
            ]}
          >
            <Image
              source={require("../../assets/images/bubble.png")}
              style={styles.gooseBubbleImage}
            />
            <Image
              source={require("../../assets/images/choose_goose.png")}
              style={styles.gooseImage}
              resizeMode="contain"
            />
          </Pressable>
        </Animated.View>
      </View>

      <View style={styles.grid}>
        {items.map((item, index) => (
          <Animated.View
            key={`${item.image}-${animationKey}`}
            style={[styles.itemBox, getBubbleStyle(index + 1)]}
          >
            <Pressable
              onPress={() => console.log("Item clicked:", item.name[language])}
              style={({ hovered, pressed }) => [
                styles.itemBubble,
                hovered && styles.bubbleHover,
                pressed && styles.bubblePressed,
              ]}
            >
              <Image source={images[item.image]} style={styles.itemImage} />
            </Pressable>

            <Text style={styles.itemName}>{item.name[language]}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </Animated.View>
        ))}
      </View>
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

  header: {
    height: 210,
    position: "relative",
  },

  titleImage: {
    position: "absolute",
    top: 10,
    left: 25,
    width: 250,
    height: 130,
  },

  speechBubble: {
    position: "absolute",
    top: 38,
    right: 145,
    width: 360,
    minHeight: 95,
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

  gooseBubbleWrapper: {
    position: "absolute",
    top: 25,
    right: 25,
  },

  gooseBubble: {
    width: 125,
    height: 125,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 3,
    borderColor: "rgba(255, 190, 255, 0.9)",
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 10,
    rowGap: 35,
    paddingHorizontal: 110,
    marginTop: 70,
  },

  itemBox: {
    width: "23%",
    alignItems: "center",
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

  itemName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    color: "black",
  },

  itemPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: "black",
  },
});