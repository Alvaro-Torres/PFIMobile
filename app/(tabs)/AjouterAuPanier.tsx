import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ajouterPanierText from "../../assets/data/panier.json";
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

export default function AjouterAuPanier() {
  const [language, setLanguage] = useState<Language>("en");
  const [quantity, setQuantity] = useState(1);
  const [item, setItem] = useState<Product | null>(null);

  const { addToCart } = useCart();

  const params = useLocalSearchParams();
  const id = Number(params.id);

  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    setItem(null);
    setQuantity(1);

    const result = await db.getFirstAsync<Product>(
      "SELECT id, name_en, name_fr, price, image, description_en, description_fr FROM products WHERE id = ?",
      [id]
    );

    setItem(result ?? null);
  }

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
        name: {
          en: item.name_en,
          fr: item.name_fr,
        },
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
          <Text style={styles.itemName}>
            {language === "en" ? item.name_en : item.name_fr}
          </Text>

          <View style={styles.bigBubble}>
            <Image source={images[item.image]} style={styles.itemImage} />
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>
              {language === "en"
                ? item.description_en
                : item.description_fr}
            </Text>
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
    marginBottom: 20,
    textAlign: "center",
  },

  bigBubble: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 4,
    borderColor: "rgba(255,120,255,1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  itemImage: {
    width: 135,
    height: 135,
    resizeMode: "contain",
  },

  descriptionBox: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 22,
    padding: 14,
    marginBottom: 20,
  },

  descriptionText: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },

  label: {
    fontSize: 18,
    fontWeight: "900",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },

  quantityButtonText: {
    fontSize: 28,
    fontWeight: "900",
  },

  quantityBox: {
    width: 90,
    height: 55,
    marginHorizontal: 15,
    backgroundColor: "#ffdf6b",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
    fontWeight: "900",
    marginBottom: 10,
  },

  totalText: {
    textAlign: "center",
    fontWeight: "900",
    fontSize: 20,
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
    fontWeight: "900",
  },

  errorText: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
});