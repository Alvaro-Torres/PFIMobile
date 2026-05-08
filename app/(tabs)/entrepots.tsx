import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MapView, { Circle, Marker, Polyline } from "react-native-maps";

import { router } from "expo-router";
import chemins from "../../assets/data/chemins.json";
import entrepotsData from "../../assets/data/entrepots.json";

type Language = "en" | "fr";

type Entrepot = {
    id: number;
    nom: string;
    latitude: number;
    longitude: number;
};

// Localisation fixe de la maison (remplace expo-location)
const maison = {
    latitude: 45.5017,
    longitude: -73.5673,
};

export default function Entrepots() {
    const [language, setLanguage] = useState<Language>("fr");
    const [selectedId, setSelectedId] = useState<number | null>(null);

    function handleSelect(id: number) {
        // Allume l'entrepôt si non sélectionné, éteint si déjà sélectionné
        setSelectedId(selectedId === id ? null : id);
    }

    function getPath(id: number) {
        // Récupère les coordonnées du chemin depuis le fichier JSON
        const key = String(id) as keyof typeof chemins;
        return chemins[key];
    }

    return (
        <View style={styles.container}>

            {/* 25% — liste des entrepôts */}
            <View style={styles.liste}>
                <Text style={styles.listeTitle}>
                    {language === "en" ? "Warehouses" : "Entrepôts"}
                </Text>

                <ScrollView>
                    {entrepotsData.map((e: Entrepot) => (
                        <Pressable
                            key={e.id}
                            style={[
                                styles.listeItem,
                                selectedId === e.id && styles.listeItemSelected,
                            ]}
                            onPress={() => handleSelect(e.id)}
                        >
                            <Text
                                style={[
                                    styles.listeItemText,
                                    selectedId === e.id && styles.listeItemTextSelected,
                                ]}
                            >
                                {e.nom}
                            </Text>
                        </Pressable>
                    ))}
                    <Pressable
                        style={styles.listeItem}
                        onPress={() => router.push("/")}
                    >
                        <Text style={styles.listeItemText}>
                            {language === "en" ? "<- Home" : "<- Retour"}
                        </Text>
                    </Pressable>
                </ScrollView>

                <Pressable
                    style={styles.languageButton}
                    onPress={() => setLanguage(language === "en" ? "fr" : "en")}
                >
                    <Text style={styles.languageButtonText}>
                        {language === "en" ? "FR" : "EN"}
                    </Text>
                </Pressable>
            </View>

            {/* 75% — la carte */}
            <View style={styles.carte}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 45.5200,
                        longitude: -73.6000,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }}
                >
                    {/* Icône maison */}
                    <Marker
                        coordinate={maison}
                        title={language === "en" ? "Home" : "Maison"}
                        pinColor="green"
                    />

                    {/* Marqueurs des entrepôts */}
                    {entrepotsData.map((e: Entrepot) => (
                        <Marker
                            key={e.id}
                            coordinate={{ latitude: e.latitude, longitude: e.longitude }}
                            title={e.nom}
                            pinColor={selectedId === e.id ? "blue" : "red"}
                            onPress={() => handleSelect(e.id)}
                        />
                    ))}

                    {/* Cercle de 5km autour de chaque entrepôt */}
                    {entrepotsData.map((e: Entrepot) => (
                        <Circle
                            key={e.id}
                            center={{ latitude: e.latitude, longitude: e.longitude }}
                            radius={5000}
                            strokeColor={
                                selectedId === e.id
                                    ? "rgba(0,100,255,0.8)"
                                    : "rgba(255,0,0,0.3)"
                            }
                            fillColor={
                                selectedId === e.id
                                    ? "rgba(0,100,255,0.15)"
                                    : "rgba(255,0,0,0.05)"
                            }
                        />
                    ))}

                    {/* Chemin tracé vers l'entrepôt sélectionné */}
                    {selectedId && (
                        <Polyline
                            coordinates={getPath(selectedId)}
                            strokeColor="blue"
                            strokeWidth={3}
                        />
                    )}
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
    },

    // 25% liste
    liste: {
        flex: 0.25,
        backgroundColor: "rgba(255,248,214,0.97)",
        borderRightWidth: 3,
        borderRightColor: "black",
        paddingTop: 50,
        paddingHorizontal: 6,
    },

    listeTitle: {
        fontSize: 13,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 10,
    },

    listeItem: {
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
        alignItems: "center",
    },

    listeItemSelected: {
        backgroundColor: "#b8f7ff",
        borderColor: "blue",
    },

    listeItemText: {
        fontSize: 11,
        fontWeight: "700",
        textAlign: "center",
    },

    listeItemTextSelected: {
        color: "blue",
    },

    languageButton: {
        marginTop: 10,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 15,
        paddingVertical: 5,
        alignItems: "center",
        marginBottom: 10,
    },

    languageButtonText: {
        fontSize: 12,
        fontWeight: "900",
    },

    // 75% carte
    carte: {
        flex: 0.75,
    },

    map: {
        flex: 1,
    },
});