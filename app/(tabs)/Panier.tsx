import { Link, router } from "expo-router";
import { useState } from "react";
import {
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import panierText from "../../assets/data/panier.json";
import { useCart } from "../../components/PanierContext";

type Language = "en" | "fr";

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

export default function Panier() {
  const [language, setLanguage] = useState<Language>("en");

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
  }

function validateCart() {
  if (cartItems.length === 0) return;

  console.log("Items ajoutés à l'inventaire:", cartItems);

  clearCart();
router.push("/PanierValide" as any);
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

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{panierText.cartTitle[language]}</Text>

          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>
              {panierText.emptyCart[language]}
            </Text>
          ) : (
            cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <View key={item.id} style={styles.itemCard}>
                  <Text style={styles.itemName}>{item.name[language]}</Text>

                  <View style={styles.itemRow}>
                    <View style={styles.itemBubble}>
                      <Image
                        source={images[item.image]}
                        style={styles.itemImage}
                      />
                    </View>

                    <View style={styles.quantitySection}>
                      <View style={styles.quantityRow}>
                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => decreaseQuantity(item.id)}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </Pressable>

                        <View style={styles.quantityBox}>
                          <Text style={styles.quantityText}>
                            {item.quantity}
                          </Text>
                        </View>

                        <Pressable
                          style={styles.quantityButton}
                          onPress={() => increaseQuantity(item.id)}
                        >
                          <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                      </View>

                      <Text style={styles.itemTotal}>
                        {panierText.itemTotal[language]} : {itemTotal}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          <View style={styles.totalBox}>
            <Text style={styles.cartTotalText}>
              {panierText.cartTotal[language]} : {cartTotal}
            </Text>
          </View>

          <Pressable style={styles.validateButton} onPress={validateCart}>
            <Text style={styles.buttonText}>
              {panierText.validateCart[language]}
            </Text>
          </Pressable>

          <Pressable style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.buttonText}>
              {panierText.clearCart[language]}
            </Text>
          </Pressable>

          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.buttonText}>
                {panierText.backShop[language]}
              </Text>
            </Pressable>
          </Link>
        </View>
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
    padding: 25,
  },

  card: {
    width: "92%",
    maxWidth: 650,
    backgroundColor: "rgba(255,248,214,0.94)",
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 32,
    padding: 25,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "900",
    marginVertical: 25,
  },

  itemCard: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },

  itemName: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  itemBubble: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 3,
    borderColor: "rgba(255,120,255,1)",
    alignItems: "center",
    justifyContent: "center",
  },

  itemImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  quantitySection: {
    alignItems: "center",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  quantityButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "#b8f7ff",
    borderWidth: 3,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontSize: 24,
    fontWeight: "900",
  },

  quantityBox: {
    width: 70,
    height: 45,
    marginHorizontal: 10,
    backgroundColor: "#ffdf6b",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontSize: 22,
    fontWeight: "900",
  },

  itemTotal: {
    fontSize: 16,
    fontWeight: "900",
  },

  totalBox: {
    width: "100%",
    backgroundColor: "#ffdf6b",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },

  cartTotalText: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  validateButton: {
    width: "100%",
    backgroundColor: "#b8f7ff",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  clearButton: {
    width: "100%",
    backgroundColor: "#ffb3b3",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  backButton: {
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "900",
  },
});