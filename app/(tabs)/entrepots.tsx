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

// Type représentant un entrepôt avec ses coordonnées
type Entrepot = {
    id: number;
    nom: string;
    latitude: number;
    longitude: number;
};

// Localisation fixe de la maison 
const maison = {
    latitude: 45.5017,
    longitude: -73.5673,
};

export default function Entrepots() {
    const [language, setLanguage] = useState<Language>("fr");

    // Garde en mémoire l'id de l'entrepôt sélectionné (null = aucun sélectionné)
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Sélectionne l'entrepôt cliqué, ou le désélectionne s'il était déjà actif
    function handleSelect(id: number) {
        setSelectedId(selectedId === id ? null : id);
    }

    // Récupère les coordonnées du chemin vers l'entrepôt depuis chemins.json
    function getPath(id: number) {
        // id est un nombre (venant du JSON entrepots) mais les clés de chemins.json sont des strings,
        // donc on convertit avec String() pour que ça corresponde ex: 1 → "1"
        const key = String(id) as keyof typeof chemins;
        return chemins[key];
    }

    return (
        // Disposition horizontale: 25% liste, 75% carte
        <View style={styles.container}>

            {/* 25% liste des entrepôts à gauche */}
            <View style={styles.liste}>
                <Text style={styles.listeTitle}>
                    {language === "en" ? "Warehouses" : "Entrepôts"}
                </Text>

                <ScrollView>
                    {/* Bouton pour chaque entrepôt, devient bleu si sélectionné */}
                    {entrepotsData.map((entrep: Entrepot) => (
                        <Pressable
                            key={entrep.id}
                            style={[
                                styles.listeItem,
                                selectedId === entrep.id && styles.listeItemSelected,
                            ]}
                            onPress={() => handleSelect(entrep.id)}
                        >
                            <Text
                                style={[
                                    styles.listeItemText,
                                    selectedId === entrep.id && styles.listeItemTextSelected,
                                ]}
                            >
                                {entrep.nom}
                            </Text>
                        </Pressable>
                    ))}

                    {/* Bouton retour vers la page principale */}
                    <Pressable
                        style={styles.listeItem}
                        onPress={() => router.push("/")}
                    >
                        <Text style={styles.listeItemText}>
                            {language === "en" ? "<- Home" : "<- Retour"}
                        </Text>
                    </Pressable>
                </ScrollView>

                {/* Bouton pour changer la langue */}
                <Pressable
                    style={styles.languageButton}
                    onPress={() => setLanguage(language === "en" ? "fr" : "en")}
                >
                    <Text style={styles.languageButtonText}>
                        {language === "en" ? "FR" : "EN"}
                    </Text>
                </Pressable>
            </View>

            {/* 75%  la carte à droite */}
            <View style={styles.carte}>
                <MapView
                    style={styles.map}
                    // Région initiale centrée sur Montréal
                    initialRegion={{
                        latitude: 45.5200,
                        longitude: -73.6000,
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }}
                >
                    {/* Marqueur vert pour la maison */}
                    <Marker
                        coordinate={maison}
                        title={language === "en" ? "Home" : "Maison"}
                        pinColor="green"
                    />

                    {/* Marqueurs rouges pour les entrepôts, bleu si sélectionné */}
                    {entrepotsData.map((entrep: Entrepot) => (
                        <Marker
                            key={entrep.id}
                            coordinate={{ latitude: entrep.latitude, longitude: entrep.longitude }}
                            title={entrep.nom}
                            pinColor={selectedId === entrep.id ? "blue" : "red"}
                            onPress={() => handleSelect(entrep.id)}
                        />
                    ))}

                    {/* Cercle de 5km autour de chaque entrepôt, bleu si sélectionné */}
                    {entrepotsData.map((entrep: Entrepot) => (
                        <Circle
                            key={entrep.id}
                            center={{ latitude: entrep.latitude, longitude: entrep.longitude }}
                            radius={5000}
                            strokeColor={
                                selectedId === entrep.id
                                    ? "rgba(0,100,255,0.8)"
                                    : "rgba(255,0,0,0.3)"
                            }
                            fillColor={
                                selectedId === entrep.id
                                    ? "rgba(0,100,255,0.15)"
                                    : "rgba(255,0,0,0.05)"
                            }
                        />
                    ))}

                    {/* Chemin tracé en bleu de la maison vers l'entrepôt sélectionné */}
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
    // Conteneur principal horizontal (liste + carte côte à côte)
    container: {
        flex: 1,
        flexDirection: "row",
    },

    // 25% liste à gauche
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

    // 75% carte à droite
    carte: {
        flex: 0.75,
    },

    // La carte prend tout l'espace disponible
    map: {
        flex: 1,
    },
});