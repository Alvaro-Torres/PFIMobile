import { Link } from "expo-router";
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

import db from "../../database";

type Language = "en" | "fr";

type InventoryItem = {
  product_id: number;
  quantity: number;
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

export default function Inventaire() {
  const [language, setLanguage] = useState<Language>("fr");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const userId = 1;

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    const result = await db.getAllAsync<InventoryItem>(
      `
      SELECT 
        inventory.product_id,
        inventory.quantity,
        products.name_en,
        products.name_fr,
        products.price,
        products.image,
        products.description_en,
        products.description_fr
      FROM inventory
      INNER JOIN products
      ON inventory.product_id = products.id
      WHERE inventory.user_id = ?
      `,
      [userId]
    );

    setInventoryItems(result);
  }

  function changeLanguage() {
    setLanguage(language === "en" ? "fr" : "en");
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
          <Text style={styles.title}>
            {language === "en" ? "Inventory" : "Inventaire"}
          </Text>

          {inventoryItems.length === 0 ? (
            <Text style={styles.emptyText}>
              {language === "en"
                ? "Your inventory is empty"
                : "Votre inventaire est vide"}
            </Text>
          ) : (
            inventoryItems.map((item) => (
              <View key={item.product_id} style={styles.itemCard}>
                <View style={styles.itemBubble}>
                  <Image source={images[item.image]} style={styles.itemImage} />
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {language === "en" ? item.name_en : item.name_fr}
                  </Text>

                  <Text style={styles.description}>
                    {language === "en"
                      ? item.description_en
                      : item.description_fr}
                  </Text>

                  <Text style={styles.quantity}>
                    {language === "en" ? "Quantity" : "Quantité"} :{" "}
                    {item.quantity}
                  </Text>
                </View>
              </View>
            ))
          )}

          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.buttonText}>
                {language === "en" ? "Back to shop" : "Retour au magasin"}
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
    paddingTop: 70,
    paddingBottom: 70,
  },

  card: {
    width: "95%",
    backgroundColor: "rgba(255,248,214,0.94)",
    borderWidth: 4,
    borderColor: "black",
    borderRadius: 32,
    padding: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },

  itemCard: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 25,
    padding: 14,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  itemBubble: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 3,
    borderColor: "rgba(255,120,255,1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  itemImage: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },

  description: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },

  quantity: {
    fontSize: 15,
    fontWeight: "900",
  },

  backButton: {
    marginTop: 10,
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
  },
});