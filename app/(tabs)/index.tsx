import { useAudioPlayer } from "expo-audio";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import gooseQuotes from "../../assets/data/gooseQuotes.json";
import ChooseGooseHeader from "../../components/ChooseGooseHeader";
import { useCart } from "../../components/PanierContext";
import db from "../../database";

type Language = "en" | "fr";

type Product = {
  id: number;
  name_en: string;
  name_fr: string;
  price: number;
  image: string;
  description_en: string;
  description_fr: string;
};

const music = require("../../assets/sfx/adventure_time.mp3");

const images: Record<string, any> = {
  finn_sword: require("../../assets/images/finn_sword.png"),
  icecrown: require("../../assets/images/icecrown.png"),
  marceline_guitar: require("../../assets/images/marceline_guitar.png"),
  billy_sword: require("../../assets/images/billy_sword.png"),
  jakes_sandwich: require("../../assets/images/jakes_sandwich.png"),
  thumb_armor: require("../../assets/images/thumb_armor.png"),
  enchiridion: require("../../assets/images/Enchiridion.png"),
  demon_blood_sword: require("../../assets/images/demon_blood_sword.png"),
};

export default function Index() {
  const [language, setLanguage] = useState<Language>("en");
  const [products, setProducts] = useState<Product[]>([]);
  const [showHiddenProductsPopup, setShowHiddenProductsPopup] = useState(false);
  const [hiddenProducts, setHiddenProducts] = useState<Product[]>([]);

  const itemAnimations = useRef<Animated.Value[]>([]);

  const { loggedUser, setLoggedUser } = useCart();
  const musicPlayer = useAudioPlayer(music);

  const randomIndex = Math.floor(Math.random() * gooseQuotes.length);
  const randomQuote = gooseQuotes[randomIndex];

  useFocusEffect(
    useCallback(() => {
      loadProducts();
      loadHiddenProducts();
    }, [])
  );

  async function loadProducts() {
    const result = await db.getAllAsync<Product>(
      "SELECT * FROM products WHERE visible = 1"
    );

    setProducts(result);

    itemAnimations.current = result.map(() => new Animated.Value(0));

    setTimeout(() => {
      Animated.stagger(
        130,
        itemAnimations.current.map((animation) =>
          Animated.spring(animation, {
            toValue: 1,
            friction: 3,
            tension: 90,
            useNativeDriver: true,
          })
        )
      ).start();
    }, 120);
  }

  async function loadHiddenProducts() {
    const result = await db.getAllAsync<Product>(
      "SELECT * FROM products WHERE visible = 0"
    );

    setHiddenProducts(result);
  }

  async function restoreProduct(id: number) {
    await db.runAsync("UPDATE products SET visible = 1 WHERE id = ?", [id]);
    loadProducts();
    loadHiddenProducts();
  }

  async function hideProduct(id: number) {
    await db.runAsync("UPDATE products SET visible = 0 WHERE id = ?", [id]);
    loadProducts();
    loadHiddenProducts();
  }

  function startMusic() {
    musicPlayer.loop = true;
    musicPlayer.volume = 0.5;
    musicPlayer.play();
  }

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
  }

  function getUsername() {
    const user = loggedUser as any;

    if (user?.username) {
      return user.username;
    }

    if (loggedUser?.email) {
      return loggedUser.email.split("@")[0];
    }

    return language === "en" ? "The Deer" : "Le Cerf";
  }

  function showItems() {
    const itemViews = [];

    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      const animation = itemAnimations.current[i] ?? new Animated.Value(1);

      itemViews.push(
        <Animated.View
          key={item.id}
          style={[
            styles.itemBox,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 0.6, 1],
                    outputRange: [0.2, 1.18, 1],
                  }),
                },
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [35, 0],
                  }),
                },
                {
                  rotate: animation.interpolate({
                    inputRange: [0, 0.35, 0.7, 1],
                    outputRange: ["-10deg", "8deg", "-4deg", "0deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.itemName}>
            {language === "en" ? item.name_en : item.name_fr}
          </Text>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/AjouterAuPanier",
                params: { id: item.id },
              } as any)
            }
            style={({ pressed }) => [
              styles.itemBubble,
              pressed && styles.bubblePressed,
            ]}
          >
            <Image source={images[item.image]} style={styles.itemImage} />
          </Pressable>

          <View style={styles.priceRow}>
            <Image
              source={require("../../assets/images/gold.png")}
              style={styles.goldIcon}
            />

            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>

          {loggedUser?.role === "admin" && (
            <Pressable
              style={styles.hideButton}
              onPress={() => hideProduct(item.id)}
            >
              <Text style={styles.hideButtonText}>−</Text>
            </Pressable>
          )}
        </Animated.View>
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


      {showHiddenProductsPopup && (
        <View style={styles.hiddenProductsPopup}>
          <Text style={styles.hiddenProductsPopupTitle}>
            {language === "en" ? "Hidden Products" : "Produits cachés"}
          </Text>

          {hiddenProducts.map((product) => (
            <View key={product.id} style={styles.hiddenProductRow}>
              <Text style={styles.hiddenProductName}>
                {language === "en" ? product.name_en : product.name_fr}
              </Text>

              <Pressable
                style={styles.restoreButton}
                onPress={() => restoreProduct(product.id)}
              >
                <Text style={styles.restoreButtonText}>+</Text>
              </Pressable>
            </View>
          ))}

          <Pressable
            style={styles.closePopupButton}
            onPress={() => setShowHiddenProductsPopup(false)}
          >
            <Text style={styles.closePopupButtonText}>
              {language === "en" ? "Close" : "Fermer"}
            </Text>
          </Pressable>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.musicButton} onPress={startMusic}>
          <Text style={styles.musicButtonText}>♪</Text>
        </Pressable>

        <ChooseGooseHeader
          quote={randomQuote[language]}
          language={language}
          onLanguageChange={changeLanguage}
        />

        {loggedUser?.role === "admin" && (
          <Pressable
            style={styles.showHiddenProductsButton}
            onPress={() => setShowHiddenProductsPopup(true)}
          >
            <Text style={styles.showHiddenProductsButtonText}>+</Text>
          </Pressable>
        )}

        <View style={styles.grid}>
          {products.length === 0 ? (
            <Text style={styles.emptyText}>
              {language === "en"
                ? "No products in the shop"
                : "Aucun produit dans le magasin"}
            </Text>
          ) : (
            showItems()
          )}
        </View>

        {loggedUser ? (
          <View style={styles.profileCard}>
            <Text style={styles.profileName}>{getUsername()}</Text>

            <Text>{loggedUser?.role}</Text>

            <View style={styles.soldeRow}>
              <Image
                source={require("../../assets/images/solde.png")}
                style={styles.soldeIcon}
              />

              <Text style={styles.soldeText}>{loggedUser.solde}</Text>
            </View>

            <Pressable
              style={styles.logoutButton}
              onPress={() => setLoggedUser(null)}
            >
              <Text style={styles.logoutText}>
                {language === "en" ? "Log out" : "Déconnexion"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Link href="/connexion" asChild>
            <Pressable style={styles.connexionButton}>
              <Text style={styles.connexionButtonText}>
                {language === "en"
                  ? "Login / Sign up"
                  : "Connexion / S'inscrire"}
              </Text>
            </Pressable>
          </Link>
        )}

        <Pressable
          style={styles.connexionButton}
          onPress={() => router.push("/entrepots" as any)}
        >
          <Text style={styles.connexionButtonText}>
            {language === "en" ? "Warehouses" : "Entrepôts"}
          </Text>
        </Pressable>
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
    rowGap: 25,
    columnGap: 10,
    paddingHorizontal: 10,
    marginTop: 40,
  },

  itemBox: {
    width: "45%",
    alignItems: "center",
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
    width: 105,
    height: 105,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 3,
    borderColor: "rgba(255, 190, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  bubblePressed: {
    transform: [{ scale: 0.95 }],
  },

  itemImage: {
    width: 72,
    height: 72,
    resizeMode: "contain",
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

  emptyText: {
    fontSize: 18,
    fontWeight: "900",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 18,
    padding: 15,
    textAlign: "center",
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

  profileCard: {
    alignSelf: "center",
    marginTop: 60,
    marginBottom: 80,
    backgroundColor: "#fff8d6",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  profileName: {
    fontSize: 20,
    fontWeight: "900",
    color: "black",
    marginBottom: 8,
  },

  soldeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  soldeIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 6,
  },

  soldeText: {
    fontSize: 17,
    fontWeight: "900",
    color: "black",
  },

  logoutButton: {
    backgroundColor: "#ffb3b3",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "900",
    color: "black",
  },

  hideButton: {
    marginTop: 6,
    backgroundColor: "#ffb3b3",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  hideButtonText: {
    fontSize: 20,
    fontWeight: "900",
  },

  showHiddenProductsButton: {
    alignSelf: "flex-start",
    marginLeft: 15,
    marginTop: 10,
    backgroundColor: "#b8f7ff",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  showHiddenProductsButtonText: {
    fontSize: 20,
    fontWeight: "900",
  },

  hiddenProductsPopup: {
    position: "absolute",
    top: "20%",
    left: "5%",
    right: "5%",
    backgroundColor: "rgba(255,248,214,0.97)",
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 30,
    padding: 20,
    zIndex: 20,
    alignItems: "center",
  },

  hiddenProductsPopupTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 15,
  },

  hiddenProductRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
  },

  hiddenProductName: {
    fontSize: 15,
    fontWeight: "900",
    flex: 1,
    marginRight: 10,
  },

  restoreButton: {
    backgroundColor: "#b8f7ff",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  restoreButtonText: {
    fontSize: 18,
    fontWeight: "900",
  },

  closePopupButton: {
    marginTop: 10,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },

  closePopupButtonText: {
    fontSize: 15,
    fontWeight: "900",
  },
});


// sources :
// animated : https://reactnative.dev/docs/animated
// https://www.reddit.com/r/reactnative/comments/1owhgzj/animating_app_ui_with_react_native/
// audio : https://docs.expo.dev/versions/latest/sdk/audio/
