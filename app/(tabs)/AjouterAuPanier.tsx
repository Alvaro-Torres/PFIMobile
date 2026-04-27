import { Link, router, useLocalSearchParams } from "expo-router";
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

import items from "../../assets/data/items.json";
import ajouterPanierText from "../../assets/data/panier.json";
import { useCart } from "../../components/PanierContext";

type Language = "en" | "fr";

type Item = {
  id: number;
  name: {
    en: string;
    fr: string;
  };
  price: number;
  image: string;
};

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

export default function AjouterAuPanier() {
  const [language, setLanguage] = useState<Language>("en");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const params = useLocalSearchParams();
  const id = Number(params.id);

  const item = (items as Item[]).find((x) => x.id === id);

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
  }

  function goToCart() {
    router.push("/Panier" as any);
  }

  if (!item) {
    return (
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={styles.background}
      >
        <Pressable style={styles.cartButton} onPress={goToCart}>
          <Text style={styles.cartButtonText}>🛒</Text>
        </Pressable>

        <Pressable style={styles.languageButton} onPress={changeLanguage}>
          <Text style={styles.languageButtonText}>
            {language === "en" ? "FR" : "EN"}
          </Text>
        </Pressable>

        <View style={styles.container}>
          <Text style={styles.errorText}>
            {ajouterPanierText.notFound[language]}
          </Text>

          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.buttonText}>
                {ajouterPanierText.back[language]}
              </Text>
            </Pressable>
          </Link>
        </View>
      </ImageBackground>
    );
  }

  const totalPrice = item.price * quantity;

  function addQuantity() {
    setQuantity(quantity + 1);
  }

  function removeQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function addItemToCart() {
    if (!item) return;
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      quantity
    );

    router.push("/Panier" as any);
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <Pressable style={styles.cartButton} onPress={goToCart}>
        <Text style={styles.cartButtonText}>🛒</Text>
      </Pressable>

      <Pressable style={styles.languageButton} onPress={changeLanguage}>
        <Text style={styles.languageButtonText}>
          {language === "en" ? "FR" : "EN"}
        </Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.itemName}>{item.name[language]}</Text>

          <View style={styles.bigBubble}>
            <Image source={images[item.image]} style={styles.itemImage} />
          </View>

          <Text style={styles.label}>
            {ajouterPanierText.quantity[language]}
          </Text>

          <View style={styles.quantityRow}>
            <Pressable style={styles.quantityButton} onPress={removeQuantity}>
              <Text style={styles.quantityButtonText}>-</Text>
            </Pressable>

            <View style={styles.quantityBox}>
              <Text style={styles.quantityText}>{quantity}</Text>
            </View>

            <Pressable style={styles.quantityButton} onPress={addQuantity}>
              <Text style={styles.quantityButtonText}>+</Text>
            </Pressable>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceText}>
              {ajouterPanierText.unitPrice[language]} : {item.price}
            </Text>

            <Text style={styles.totalText}>
              {ajouterPanierText.totalPrice[language]} : {totalPrice}
            </Text>
          </View>

          <Pressable style={styles.validateButton} onPress={addItemToCart}>
            <Text style={styles.buttonText}>
              {ajouterPanierText.addToCart[language]}
            </Text>
          </Pressable>

          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.buttonText}>
                {ajouterPanierText.back[language]}
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

  cartButton: {
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

  cartButtonText: {
    fontSize: 14,
    fontWeight: "900",
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
    width: "90%",
    maxWidth: 430,
    backgroundColor: "rgba(255,248,214,0.94)",
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 32,
    padding: 25,
    alignItems: "center",
  },

  itemName: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
  },

  bigBubble: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 4,
    borderColor: "rgba(255,120,255,1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  itemImage: {
    width: 135,
    height: 135,
    resizeMode: "contain",
  },

  label: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontSize: 28,
    fontWeight: "900",
  },

  quantityBox: {
    width: 90,
    height: 55,
    marginHorizontal: 15,
    borderRadius: 18,
    backgroundColor: "#ffdf6b",
    borderWidth: 3,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontSize: 24,
    fontWeight: "900",
  },

  priceBox: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    padding: 15,
    marginBottom: 20,
  },

  priceText: {
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },

  totalText: {
    fontSize: 21,
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
    marginBottom: 14,
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

  errorText: {
    fontSize: 25,
    fontWeight: "900",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "black",
    marginBottom: 20,
  },
});